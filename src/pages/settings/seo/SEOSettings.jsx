import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import PageHeader from '../../../components/common/PageHeader'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import Button from '../../../components/ui/Button'
import FileUpload from '../../../components/forms/FileUpload'
import useToastStore from '../../../store/toastStore'
import { settingService } from '../../../services/settingService'
import { validateRequired, validateLength } from '../../../utils/validation'

export default function SeoSettings() {
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: null,
    twitter_card: 'summary_large_image',
    twitter_site: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingService.getSettings()
      if (response.success && response.data.seo) {
        setFormData(prev => ({ ...prev, ...response.data.seo }))
      }
    } catch (err) {
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
    const titleError = validateRequired(formData.meta_title, 'Meta title')
    const descError = validateLength(formData.meta_description, 50, 160, 'Meta description')
    if (titleError) newErrors.meta_title = titleError
    if (descError) newErrors.meta_description = descError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })
      
      const response = await settingService.updateSeo(formDataToSend)
      if (response.success) {
        success('SEO settings saved successfully')
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
        title="SEO Settings"
        description="Optimize your website for search engines"
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="Meta Tags">
            <div className="space-y-4">
              <Input
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, meta_title: '' }) }}
                placeholder="CIDCO Mitra - Official Website"
                error={errors.meta_title}
                required
              />
              <Textarea
                label="Meta Description"
                name="meta_description"
                value={formData.meta_description}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, meta_description: '' }) }}
                rows={3}
                placeholder="Brief description for search engines (150-160 characters)"
                error={errors.meta_description}
                required
              />
              <Textarea
                label="Meta Keywords"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                rows={2}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </Card>

          <Card title="Open Graph (Facebook)">
            <div className="space-y-4">
              <Input
                label="OG Title"
                name="og_title"
                value={formData.og_title}
                onChange={handleChange}
                placeholder="Title for social media sharing"
              />
              <Textarea
                label="OG Description"
                name="og_description"
                value={formData.og_description}
                onChange={handleChange}
                rows={2}
                placeholder="Description for social media sharing"
              />
              <FileUpload
                label="OG Image (1200x630px recommended)"
                name="og_image"
                accept="image/*"
                maxSize={2}
                onChange={handleFileChange}
                preview={formData.og_image}
              />
            </div>
          </Card>

          <Card title="Twitter Card">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Card Type
                </label>
                <select
                  name="twitter_card"
                  value={formData.twitter_card}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>
              <Input
                label="Twitter Site Handle"
                name="twitter_site"
                value={formData.twitter_site}
                onChange={handleChange}
                placeholder="@yourusername"
              />
            </div>
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
