import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import PageHeader from '../../../components/common/PageHeader'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import FileUpload from '../../../components/forms/FileUpload'
import useToastStore from '../../../store/toastStore'
import { settingService } from '../../../services/settingService'
import { validateColor, validateRequired } from '../../../utils/validation'

export default function BrandingSettings() {
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    font_family: 'Inter',
    logo: null,
    favicon: null
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await settingService.getSettings()
      if (data?.success && data.data.branding) {
        const brandingData = data.data.branding
        const apiUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
        setFormData(prev => ({
          ...prev,
          primary_color: brandingData.primary_color || '#3b82f6',
          secondary_color: brandingData.secondary_color || '#64748b',
          font_family: brandingData.font_family || 'Inter',
          logo: brandingData.logo_url ? `${apiUrl}${brandingData.logo_url}` : prev.logo,
          favicon: brandingData.favicon_url ? `${apiUrl}${brandingData.favicon_url}` : prev.favicon
        }))
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      error('Failed to fetch settings')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (file, name) => {
    setFormData({ ...formData, [name]: file })
  }

  const validate = () => {
    const newErrors = {}
    const primaryError = validateColor(formData.primary_color)
    const secondaryError = validateColor(formData.secondary_color)
    const fontError = validateRequired(formData.font_family, 'Font family')
    if (primaryError) newErrors.primary_color = primaryError
    if (secondaryError) newErrors.secondary_color = secondaryError
    if (fontError) newErrors.font_family = fontError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Add colors and font
      formDataToSend.append('primary_color', formData.primary_color)
      formDataToSend.append('secondary_color', formData.secondary_color)
      formDataToSend.append('font_family', formData.font_family)
      
      // Handle logo
      if (formData.logo instanceof File) {
        formDataToSend.append('logo', formData.logo)
      } else if (formData.logo === null) {
        formDataToSend.append('remove_logo', 'true')
      }
      
      // Handle favicon
      if (formData.favicon instanceof File) {
        formDataToSend.append('favicon', formData.favicon)
      } else if (formData.favicon === null) {
        formDataToSend.append('remove_favicon', 'true')
      }
      
      const data = await settingService.updateBranding(formDataToSend)
      if (data?.success) {
        success('Branding settings saved successfully')
        await fetchSettings()
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      error(err.response?.data?.message || 'Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Branding Settings"
        description="Customize your website's visual identity"
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="Logo & Favicon">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="Website Logo"
                name="logo"
                accept="image/*"
                maxSize={2}
                onChange={handleFileChange}
                preview={formData.logo}
              />
              <FileUpload
                label="Favicon (32x32)"
                name="favicon"
                accept="image/*"
                maxSize={0.5}
                onChange={handleFileChange}
                preview={formData.favicon}
              />
            </div>
          </Card>

          <Card title="Color Theme">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="h-10 w-20 rounded border border-secondary-300"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => { handleChange(e); setErrors({ ...errors, primary_color: '' }) }}
                    name="primary_color"
                    placeholder="#3b82f6"
                    error={errors.primary_color}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="h-10 w-20 rounded border border-secondary-300"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => { handleChange(e); setErrors({ ...errors, secondary_color: '' }) }}
                    name="secondary_color"
                    placeholder="#64748b"
                    error={errors.secondary_color}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Typography">
            <Input
              label="Font Family"
              name="font_family"
              value={formData.font_family}
              onChange={(e) => { handleChange(e); setErrors({ ...errors, font_family: '' }) }}
              placeholder="Inter, Arial, sans-serif"
              error={errors.font_family}
              required
            />
          </Card>

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
