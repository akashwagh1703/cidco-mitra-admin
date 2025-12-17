import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';
import useToastStore from '../../store/toastStore';
import { appointmentService } from '../../services/appointmentService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export default function AppointmentDetail({ appointment, onClose, onUpdate }) {
  const { success, error } = useToastStore();
  const [status, setStatus] = useState(appointment.status);
  const [adminNotes, setAdminNotes] = useState(appointment.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await appointmentService.updateAppointment(appointment.id, {
        status,
        admin_notes: adminNotes,
      });
      if (response.success) {
        success('Appointment updated successfully');
        onUpdate();
        onClose();
      }
    } catch (err) {
      error('Failed to update appointment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Appointment Details" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Customer Name</label>
            <p className="mt-1 text-secondary-900 dark:text-white font-medium">{appointment.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Email</label>
            <p className="mt-1 text-secondary-900 dark:text-white font-medium">{appointment.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Phone</label>
            <p className="mt-1 text-secondary-900 dark:text-white font-medium">{appointment.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Service</label>
            <p className="mt-1 text-secondary-900 dark:text-white font-medium">
              {appointment.service?.title?.en || 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Date</label>
            <p className="mt-1 text-secondary-900 dark:text-white font-medium">
              {new Date(appointment.appointment_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Time</label>
            <p className="mt-1 text-secondary-900 dark:text-white font-medium">{appointment.appointment_time}</p>
          </div>
        </div>

        {appointment.message && (
          <div>
            <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Message</label>
            <p className="mt-1 text-secondary-600 dark:text-gray-300 bg-secondary-50 dark:bg-gray-700 p-3 rounded-md">
              {appointment.message}
            </p>
          </div>
        )}

        <div className="border-t pt-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>

        <Textarea
          label="Admin Notes"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          placeholder="Add internal notes about this appointment..."
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
