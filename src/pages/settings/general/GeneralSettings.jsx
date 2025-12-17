import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import PageHeader from '../../../components/common/PageHeader'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import Button from '../../../components/ui/Button'
import useToastStore from '../../../store/toastStore'
import { settingService } from '../../../services/settingService'
import { validateEmail, validatePhone, validateRequired } from '../../../utils/validation'

export default function GeneralSettings() {
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingService.getSettings()
      if (response.success && response.data.general) {
        setFormData(response.data.general)
      }
    } catch (err) {
      error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    const nameError = validateRequired(formData.site_name, 'Site name')
    const emailError = validateEmail(formData.contact_email)
    const phoneError = validatePhone(formData.contact_phone)
    if (nameError) newErrors.site_name = nameError
    if (emailError) newErrors.contact_email = emailError
    if (phoneError) newErrors.contact_phone = phoneError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const response = await settingService.updateGeneral(formData)
      if (response.success) {
        success('General settings saved successfully')
      }
    } catch (err) {
      error('Failed to save settings')
    }
  }

  return (
    <div>
      <PageHeader
        title="General Settings"
        description="Configure basic website information"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Site Name"
                name="site_name"
                value={formData.site_name}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, site_name: '' }) }}
                error={errors.site_name}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contact Phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, contact_phone: '' }) }}
                error={errors.contact_phone}
                required
              />
              <Input
                label="Contact Email"
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, contact_email: '' }) }}
                error={errors.contact_email}
                required
              />
            </div>

            <Textarea
              label="Physical Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            />



            <div className="flex justify-end pt-4">
              <Button type="submit">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}
