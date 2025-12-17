import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import useToastStore from '../../store/toastStore';
import { appointmentService } from '../../services/appointmentService';

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export default function ServiceSchedule({ serviceId, onClose }) {
  const { success, error } = useToastStore();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: 30,
    max_appointments_per_slot: 1,
    is_active: true,
  });

  useEffect(() => {
    fetchSchedules();
  }, [serviceId]);

  const fetchSchedules = async () => {
    try {
      const response = await appointmentService.getSchedules(serviceId);
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (err) {
      error('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedSchedule) {
        const response = await appointmentService.updateSchedule(
          serviceId,
          selectedSchedule.id,
          formData
        );
        if (response.success) {
          success('Schedule updated successfully');
        }
      } else {
        const response = await appointmentService.createSchedule(serviceId, formData);
        if (response.success) {
          success('Schedule created successfully');
        }
      }
      fetchSchedules();
      setShowForm(false);
      setSelectedSchedule(null);
      setFormData({
        day_of_week: 'monday',
        start_time: '09:00',
        end_time: '17:00',
        slot_duration: 30,
        max_appointments_per_slot: 1,
        is_active: true,
      });
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await appointmentService.deleteSchedule(serviceId, selectedSchedule.id);
      if (response.success) {
        success('Schedule deleted successfully');
        fetchSchedules();
      }
    } catch (err) {
      error('Failed to delete schedule');
    } finally {
      setShowDelete(false);
      setSelectedSchedule(null);
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time.substring(0, 5),
      end_time: schedule.end_time.substring(0, 5),
      slot_duration: schedule.slot_duration,
      max_appointments_per_slot: schedule.max_appointments_per_slot,
      is_active: schedule.is_active,
    });
    setShowForm(true);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Service Schedule" size="lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-secondary-600">
            Configure appointment availability for this service
          </p>
          <Button
            size="sm"
            onClick={() => {
              setSelectedSchedule(null);
              setFormData({
                day_of_week: 'monday',
                start_time: '09:00',
                end_time: '17:00',
                slot_duration: 30,
                max_appointments_per_slot: 1,
                is_active: true,
              });
              setShowForm(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Schedule
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8 text-secondary-500">
            No schedules configured. Add a schedule to enable appointments.
          </div>
        ) : (
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-secondary-900 capitalize">
                      {schedule.day_of_week}
                    </span>
                    <Badge variant={schedule.is_active ? 'success' : 'default'}>
                      {schedule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-secondary-600">
                    <Clock size={14} className="inline mr-1" />
                    {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)} |
                    {schedule.slot_duration} min slots | Max {schedule.max_appointments_per_slot}{' '}
                    per slot
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(schedule)}>
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setShowDelete(true);
                    }}
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowForm(false);
            setSelectedSchedule(null);
          }}
          title={selectedSchedule ? 'Edit Schedule' : 'Add Schedule'}
          size="md"
        >
          <div className="space-y-4">
            <Select
              label="Day of Week"
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
              options={daysOfWeek}
              disabled={!!selectedSchedule}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
              <Input
                label="End Time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
            <Input
              label="Slot Duration (minutes)"
              type="number"
              value={formData.slot_duration}
              onChange={(e) => setFormData({ ...formData, slot_duration: parseInt(e.target.value) })}
              min="15"
              max="240"
            />
            <Input
              label="Max Appointments Per Slot"
              type="number"
              value={formData.max_appointments_per_slot}
              onChange={(e) =>
                setFormData({ ...formData, max_appointments_per_slot: parseInt(e.target.value) })
              }
              min="1"
              max="50"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-secondary-700">Active</label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setSelectedSchedule(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {selectedSchedule ? 'Update' : 'Create'} Schedule
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This will affect appointment availability."
      />
    </Modal>
  );
}
