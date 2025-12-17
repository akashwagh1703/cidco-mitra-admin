import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, CalendarCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ServiceSchedule from './ServiceSchedule'
import useToastStore from '../../store/toastStore'
import { serviceService } from '../../services/serviceService'
import { validateRequired } from '../../utils/validation'

export default function Services() {
  const navigate = useNavigate()
  const { success, error } = useToastStore()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    title: { en: '', mr: '', hi: '' },
    description: { en: '', mr: '', hi: '' },
    overview: { en: '', mr: '', hi: '' },
    pricing: { en: '', mr: '', hi: '' },
    documents: { en: '', mr: '', hi: '' },
    timeline: { en: '', mr: '', hi: '' },
    icon: '',
    phone: '',
    whatsapp: '',
    appointment_url: '',
    status: true,
    order: 0
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await serviceService.getServices(true)
      if (data.success) {
        setServices(data.data)
      }
    } catch (err) {
      error('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setSelectedService(service)
    setFormData(service)
    setShowModal(true)
  }

  const handleDelete = (service) => {
    setSelectedService(service)
    setShowDeleteDialog(true)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.en) newErrors.title_en = 'English title is required'
    if (!formData.description.en) newErrors.description_en = 'English description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (selectedService) {
        const data = await serviceService.updateService(selectedService.id, formData)
        if (data.success) {
          success('Service updated successfully')
          fetchServices()
        }
      } else {
        const data = await serviceService.createService(formData)
        if (data.success) {
          success('Service created successfully')
          fetchServices()
        }
      }
      setShowModal(false)
      setSelectedService(null)
      setFormData({
        title: { en: '', mr: '', hi: '' },
        description: { en: '', mr: '', hi: '' },
        overview: { en: '', mr: '', hi: '' },
        pricing: { en: '', mr: '', hi: '' },
        documents: { en: '', mr: '', hi: '' },
        timeline: { en: '', mr: '', hi: '' },
        icon: '',
        phone: '',
        whatsapp: '',
        appointment_url: '',
        status: true,
        order: 0
      })
      setErrors({})
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed')
    }
  }

  const confirmDelete = async () => {
    try {
      const data = await serviceService.deleteService(selectedService.id)
      if (data.success) {
        success('Service deleted successfully')
        fetchServices()
      }
    } catch (err) {
      error('Failed to delete service')
    } finally {
      setShowDeleteDialog(false)
      setSelectedService(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Services Management"
        description="Manage services displayed on website"
        action={
          <Button onClick={() => { setSelectedService(null); setFormData({ title: { en: '', mr: '', hi: '' }, description: { en: '', mr: '', hi: '' }, overview: { en: '', mr: '', hi: '' }, pricing: { en: '', mr: '', hi: '' }, documents: { en: '', mr: '', hi: '' }, timeline: { en: '', mr: '', hi: '' }, icon: '', phone: '', whatsapp: '', appointment_url: '', status: true, order: 0 }); setShowModal(true) }}>
            <Plus size={16} className="mr-2" />
            Add Service
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No services found</div>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{service.title?.en || service.title}</h3>
                  <Badge variant={service.status ? 'success' : 'default'}>
                    {service.status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-secondary-600 dark:text-gray-400">{service.description?.en || service.description}</p>
                {service.icon && (
                  <p className="text-xs text-secondary-500 dark:text-gray-500">Icon: {service.icon}</p>
                )}
                <div className="flex flex-col gap-2 pt-4 border-t border-secondary-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(service)} className="flex-1">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(service)} className="flex-1">
                      <Trash2 size={14} className="mr-1 text-red-600" />
                      Delete
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedService(service); setShowSchedule(true); }} className="flex-1">
                      <Calendar size={14} className="mr-1" />
                      Schedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={() => navigate(`/appointments?service=${service.id}`)}
                      className="flex-1 relative"
                    >
                      <CalendarCheck size={14} className="mr-1" />
                      Appointments
                      {service.appointments_count > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-white text-primary-600 rounded-full font-semibold">
                          {service.appointments_count}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedService ? 'Edit Service' : 'Add Service'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Title (Multilingual)</h4>
            <Input label="English" value={formData.title.en} onChange={(e) => { setFormData({ ...formData, title: { ...formData.title, en: e.target.value } }); setErrors({ ...errors, title_en: '' }) }} error={errors.title_en} required />
            <Input label="Marathi (मराठी)" value={formData.title.mr} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, mr: e.target.value } })} />
            <Input label="Hindi (हिंदी)" value={formData.title.hi} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, hi: e.target.value } })} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Description (Multilingual)</h4>
            <Textarea label="English" value={formData.description.en} onChange={(e) => { setFormData({ ...formData, description: { ...formData.description, en: e.target.value } }); setErrors({ ...errors, description_en: '' }) }} rows={3} error={errors.description_en} required />
            <Textarea label="Marathi (मराठी)" value={formData.description.mr} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, mr: e.target.value } })} rows={3} />
            <Textarea label="Hindi (हिंदी)" value={formData.description.hi} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, hi: e.target.value } })} rows={3} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Overview (Optional)</h4>
            <Textarea label="English" value={formData.overview.en} onChange={(e) => setFormData({ ...formData, overview: { ...formData.overview, en: e.target.value } })} rows={2} />
            <Textarea label="Marathi" value={formData.overview.mr} onChange={(e) => setFormData({ ...formData, overview: { ...formData.overview, mr: e.target.value } })} rows={2} />
            <Textarea label="Hindi" value={formData.overview.hi} onChange={(e) => setFormData({ ...formData, overview: { ...formData.overview, hi: e.target.value } })} rows={2} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Pricing (Optional)</h4>
            <Textarea label="English" value={formData.pricing.en} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, en: e.target.value } })} rows={2} placeholder="e.g., Starting from ₹50,000" />
            <Textarea label="Marathi" value={formData.pricing.mr} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, mr: e.target.value } })} rows={2} />
            <Textarea label="Hindi" value={formData.pricing.hi} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, hi: e.target.value } })} rows={2} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Required Documents (Optional)</h4>
            <Textarea label="English" value={formData.documents.en} onChange={(e) => setFormData({ ...formData, documents: { ...formData.documents, en: e.target.value } })} rows={2} placeholder="e.g., ID Proof, Address Proof" />
            <Textarea label="Marathi" value={formData.documents.mr} onChange={(e) => setFormData({ ...formData, documents: { ...formData.documents, mr: e.target.value } })} rows={2} />
            <Textarea label="Hindi" value={formData.documents.hi} onChange={(e) => setFormData({ ...formData, documents: { ...formData.documents, hi: e.target.value } })} rows={2} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Process Timeline (Optional)</h4>
            <Textarea label="English" value={formData.timeline.en} onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline, en: e.target.value } })} rows={2} placeholder="e.g., 30-45 days" />
            <Textarea label="Marathi" value={formData.timeline.mr} onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline, mr: e.target.value } })} rows={2} />
            <Textarea label="Hindi" value={formData.timeline.hi} onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline, hi: e.target.value } })} rows={2} />
          </div>

          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-secondary-900 dark:text-white">Contact & Assistance</h4>
            <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 1234567890" />
            <Input label="WhatsApp" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="+91 1234567890" />
            <Input label="Appointment URL" value={formData.appointment_url} onChange={(e) => setFormData({ ...formData, appointment_url: e.target.value })} placeholder="https://calendly.com/..." />
          </div>

          <div className="border-t pt-4 space-y-3">
            <Input label="Icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Building2" />
            <Input label="Order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} className="rounded border-secondary-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
              <label className="text-sm text-secondary-700 dark:text-gray-300">Active</label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{selectedService ? 'Update' : 'Create'} Service</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete ${selectedService?.title}? This action cannot be undone.`}
      />

      {showSchedule && selectedService && (
        <ServiceSchedule
          serviceId={selectedService.id}
          onClose={() => {
            setShowSchedule(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  )
}
