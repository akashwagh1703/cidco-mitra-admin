import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/tables/Table';
import Pagination from '../../components/tables/Pagination';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AppointmentDetail from './AppointmentDetail';
import useToastStore from '../../store/toastStore';
import { appointmentService } from '../../services/appointmentService';
import { serviceService } from '../../services/serviceService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export default function AppointmentList({ onUpdate, serviceFilter }) {
  const { success, error } = useToastStore();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    service_id: serviceFilter || '',
    date_from: '',
    date_to: '',
  });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, [filters, pagination.current_page]);

  useEffect(() => {
    if (serviceFilter) {
      setFilters(prev => ({ ...prev, service_id: serviceFilter }));
    }
  }, [serviceFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments({
        ...filters,
        page: pagination.current_page,
      });
      if (data.success) {
        setAppointments(data.data.data);
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
        });
      }
    } catch (err) {
      error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceService.getServices();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services');
    }
  };

  const handleDelete = async () => {
    try {
      const data = await appointmentService.deleteAppointment(selectedAppointment.id);
      if (data.success) {
        success('Appointment deleted successfully');
        fetchAppointments();
        onUpdate?.();
      }
    } catch (err) {
      error('Failed to delete appointment');
    } finally {
      setShowDelete(false);
      setSelectedAppointment(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const data = await appointmentService.updateAppointment(id, { status });
      if (data.success) {
        success('Status updated successfully');
        fetchAppointments();
        onUpdate?.();
      }
    } catch (err) {
      error('Failed to update status');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-secondary-900 dark:text-white">{row.name}</div>
          <div className="text-sm text-secondary-500 dark:text-gray-400">{row.email}</div>
          <div className="text-sm text-secondary-500 dark:text-gray-400">{row.phone}</div>
        </div>
      ),
    },
    {
      key: 'service',
      label: 'Service',
      render: (row) => (
        <span className="text-sm text-secondary-900 dark:text-white">{row.service?.title?.en || 'N/A'}</span>
      ),
    },
    {
      key: 'appointment_date',
      label: 'Date & Time',
      render: (row) => (
        <div>
          <div className="font-medium text-secondary-900 dark:text-white">{new Date(row.appointment_date).toLocaleDateString()}</div>
          <div className="text-sm text-secondary-500 dark:text-gray-400">{row.appointment_time}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge className={statusColors[row.status]}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedAppointment(row);
              setShowDetail(true);
            }}
          >
            <Eye size={14} />
          </Button>
          {row.status === 'pending' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleStatusUpdate(row.id, 'confirmed')}
            >
              Confirm
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedAppointment(row);
              setShowDelete(true);
            }}
          >
            <Trash2 size={14} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          placeholder="Search by name, email, phone..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={[
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <Select
          value={filters.service_id}
          onChange={(e) => setFilters({ ...filters, service_id: e.target.value })}
          options={[
            { value: '', label: 'All Services' },
            ...services.map((s) => ({ value: s.id, label: s.title?.en || s.title })),
          ]}
        />
        <Input
          type="date"
          value={filters.date_from}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          placeholder="From Date"
        />
        <Input
          type="date"
          value={filters.date_to}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          placeholder="To Date"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <Table columns={columns} data={appointments} />
          {pagination.last_page > 1 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={(page) => setPagination({ ...pagination, current_page: page })}
            />
          )}
        </>
      )}

      {showDetail && selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetail(false);
            setSelectedAppointment(null);
          }}
          onUpdate={() => {
            fetchAppointments();
            onUpdate?.();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
      />
    </div>
  );
}
