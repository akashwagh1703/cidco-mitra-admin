import { useState, useEffect } from 'react'
import { Save, Mail } from 'lucide-react'
import PageHeader from '../../../components/common/PageHeader'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import useToastStore from '../../../store/toastStore'
import { settingService } from '../../../services/settingService'
import { validateEmail, validateRequired, validateNumber } from '../../../utils/validation'

export default function EmailSettings() {
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [smtpPasswordSet, setSmtpPasswordSet] = useState(false)
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingService.getSettings()
      if (response.success && response.data.email) {
        const email = response.data.email
        const { smtp_password, smtp_password_set, ...rest } = email
        setSmtpPasswordSet(Boolean(smtp_password_set) || Boolean(smtp_password))
        setFormData(prev => ({
          ...prev,
          ...rest,
          smtp_password: '',
        }))
      }
    } catch (err) {
      error('Failed to fetch settings')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    const hostError = validateRequired(formData.smtp_host, 'SMTP host')
    const portError = validateNumber(formData.smtp_port, 1, 65535)
    const usernameError = validateRequired(formData.smtp_username, 'SMTP username')
    const fromEmailError = validateEmail(formData.from_email)
    const fromNameError = validateRequired(formData.from_name, 'From name')
    if (hostError) newErrors.smtp_host = hostError
    if (portError) newErrors.smtp_port = portError
    if (usernameError) newErrors.smtp_username = usernameError
    if (!smtpPasswordSet && !formData.smtp_password) {
      newErrors.smtp_password = 'SMTP password is required'
    }
    if (fromEmailError) newErrors.from_email = fromEmailError
    if (fromNameError) newErrors.from_name = fromNameError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      const payload = { ...formData }
      if (!payload.smtp_password) {
        delete payload.smtp_password
      }
      const response = await settingService.updateEmail(payload)
      if (response.success) {
        success('Email settings saved successfully')
        if (formData.smtp_password) {
          setSmtpPasswordSet(true)
          setFormData(prev => ({ ...prev, smtp_password: '' }))
        }
      }
    } catch (err) {
      error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Email Settings"
        description="Configure SMTP settings for sending emails"
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="SMTP Configuration">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Host"
                  name="smtp_host"
                  value={formData.smtp_host}
                  onChange={(e) => { handleChange(e); setErrors({ ...errors, smtp_host: '' }) }}
                  placeholder="smtp.gmail.com"
                  error={errors.smtp_host}
                  required
                />
                <Input
                  label="SMTP Port"
                  name="smtp_port"
                  type="number"
                  value={formData.smtp_port}
                  onChange={(e) => { handleChange(e); setErrors({ ...errors, smtp_port: '' }) }}
                  placeholder="587"
                  error={errors.smtp_port}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Username"
                  name="smtp_username"
                  value={formData.smtp_username}
                  onChange={(e) => { handleChange(e); setErrors({ ...errors, smtp_username: '' }) }}
                  placeholder="your-email@gmail.com"
                  error={errors.smtp_username}
                  required
                />
                <div>
                  <Input
                    label="SMTP Password"
                    name="smtp_password"
                    type="password"
                    value={formData.smtp_password}
                    onChange={(e) => { handleChange(e); setErrors({ ...errors, smtp_password: '' }) }}
                    placeholder="Leave blank to keep current password"
                    error={errors.smtp_password}
                    autoComplete="new-password"
                    required={!smtpPasswordSet}
                  />
                  <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                    {smtpPasswordSet
                      ? 'Leave blank to keep the current password.'
                      : 'Enter an SMTP password to enable email sending.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Encryption
                </label>
                <select
                  name="smtp_encryption"
                  value={formData.smtp_encryption}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Email From">
            <div className="space-y-4">
              <Input
                label="From Email"
                name="from_email"
                type="email"
                value={formData.from_email}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, from_email: '' }) }}
                placeholder="noreply@cidcomitra.gov.in"
                error={errors.from_email}
                required
              />
              <Input
                label="From Name"
                name="from_name"
                value={formData.from_name}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, from_name: '' }) }}
                placeholder="CIDCO Mitra"
                error={errors.from_name}
                required
              />
            </div>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <Mail className="text-blue-600 dark:text-blue-400 mt-0.5 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Gmail Configuration</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  For Gmail, use smtp.gmail.com with port 587 (TLS). 
                  You'll need to generate an App Password from your Google Account settings.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Save size={16} className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
