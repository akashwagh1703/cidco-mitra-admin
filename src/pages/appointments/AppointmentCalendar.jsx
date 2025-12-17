import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import AppointmentDetail from './AppointmentDetail';
import useToastStore from '../../store/toastStore';
import { appointmentService } from '../../services/appointmentService';

const statusColors = {
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  confirmed: 'bg-green-50 border-green-200 text-green-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
  completed: 'bg-blue-50 border-blue-200 text-blue-700',
};

export default function AppointmentCalendar({ serviceFilter }) {
  const { error } = useToastStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, serviceFilter]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const params = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      };
      if (serviceFilter) {
        params.service_id = serviceFilter;
      }
      const data = await appointmentService.getCalendar(params.month, params.year);
      if (data?.success) {
        // Filter by service if needed
        let filteredData = data.data;
        if (serviceFilter) {
          filteredData = {};
          Object.keys(data.data).forEach(date => {
            const filtered = data.data[date].filter(apt => apt.service_id === parseInt(serviceFilter));
            if (filtered.length > 0) {
              filteredData[date] = filtered;
            }
          });
        }
        setAppointments(filteredData);
      }
    } catch (err) {
      error('Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getAppointmentsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments[dateStr] || [];
  };

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-primary-900 dark:text-white">{monthName}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={previousMonth} className="hover:bg-white dark:hover:bg-gray-600">
            <ChevronLeft size={18} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button size="sm" variant="ghost" onClick={nextMonth} className="hover:bg-white dark:hover:bg-gray-600">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="text-center font-semibold text-secondary-700 dark:text-gray-300 py-3 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                <div className="hidden md:block">{day}</div>
                <div className="md:hidden">{day.slice(0, 3)}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">
            {days.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentDay = isToday(day);
              return (
                <div
                  key={index}
                  className={`min-h-32 border-r border-b border-gray-200 dark:border-gray-700 p-2 transition-colors ${
                    day ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900'
                  } ${isCurrentDay ? 'ring-2 ring-primary-500 ring-inset' : ''} last:border-r-0`}
                >
                  {day && (
                    <>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                        isCurrentDay ? 'bg-primary-600 text-white font-bold' : 'text-secondary-900 dark:text-white font-semibold'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs p-1.5 rounded border cursor-pointer hover:shadow-md transition-shadow ${
                              statusColors[apt.status]
                            }`}
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowDetail(true);
                            }}
                            title={`${apt.name} - ${apt.service?.title?.en || 'Service'}`}
                          >
                            <div className="flex items-center gap-1 font-medium">
                              <Clock size={10} />
                              <span>{apt.appointment_time?.substring(0, 5)}</span>
                            </div>
                            <div className="truncate font-semibold">{apt.name}</div>
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-center py-1 bg-gray-100 dark:bg-gray-700 rounded text-secondary-600 dark:text-gray-400 font-medium">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showDetail && selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetail(false);
            setSelectedAppointment(null);
          }}
          onUpdate={() => {
            fetchCalendarData();
          }}
        />
      )}
    </div>
  );
}
