import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, List, Filter, Download, ArrowLeft, Package } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import AppointmentList from './AppointmentList';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentStats from './AppointmentStats';
import useToastStore from '../../store/toastStore';
import { appointmentService } from '../../services/appointmentService';

export default function Appointments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceFilter = searchParams.get('service');
  const { success, error } = useToastStore();
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchStats();
    if (serviceFilter) {
      fetchServiceName();
    }
  }, [serviceFilter]);

  const fetchServiceName = async () => {
    try {
      const { serviceService } = await import('../../services/serviceService');
      const data = await serviceService.getServices();
      if (data.success) {
        const service = data.data.find(s => s.id === parseInt(serviceFilter));
        setSelectedService(service);
      }
    } catch (err) {
      console.error('Failed to fetch service');
    }
  };

  const fetchStats = async () => {
    try {
      const data = await appointmentService.getStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      error('Failed to fetch appointment stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {serviceFilter && selectedService && (
        <Card className="mb-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                <Package size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-gray-400">Filtered by Service</p>
                <p className="font-semibold text-secondary-900 dark:text-white">{selectedService.title?.en || selectedService.title}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/appointments')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Show All Appointments
            </Button>
          </div>
        </Card>
      )}

      <PageHeader
        title="Appointments"
        description="Manage service appointments and schedules"
        action={
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'ghost'}
              onClick={() => setView('list')}
            >
              <List size={16} className="mr-2" />
              List View
            </Button>
            <Button
              variant={view === 'calendar' ? 'primary' : 'ghost'}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon size={16} className="mr-2" />
              Calendar View
            </Button>
          </div>
        }
      />

      {!loading && stats && <AppointmentStats stats={stats} />}

      <Card>
        {view === 'list' ? (
          <AppointmentList onUpdate={fetchStats} serviceFilter={serviceFilter} />
        ) : (
          <AppointmentCalendar serviceFilter={serviceFilter} />
        )}
      </Card>
    </div>
  );
}
