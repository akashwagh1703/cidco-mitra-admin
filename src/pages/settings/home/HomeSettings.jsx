import { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../../../components/common/PageHeader'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import Button from '../../../components/ui/Button'
import useToastStore from '../../../store/toastStore'
import { settingService } from '../../../services/settingService'
import { validateRequired } from '../../../utils/validation'

export default function HomeSettings() {
  const { success, error } = useToastStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_cta_text: '',
    hero_cta_link: '',
    about_title: '',
    about_description: '',
    features: [
      { title: '', description: '', icon: '' }
    ]
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingService.getSettings()
      if (response.success && response.data.homepage) {
        setFormData(prev => ({ ...prev, ...response.data.homepage }))
      }
    } catch (err) {
      error('Failed to fetch settings')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index][field] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: '', description: '', icon: '' }]
    })
  }

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures })
  }

  const validate = () => {
    const newErrors = {}
    const titleError = validateRequired(formData.hero_title, 'Hero title')
    const subtitleError = validateRequired(formData.hero_subtitle, 'Hero subtitle')
    if (titleError) newErrors.hero_title = titleError
    if (subtitleError) newErrors.hero_subtitle = subtitleError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      const response = await settingService.updateHomepage(formData)
      if (response.success) {
        success('Homepage settings saved successfully')
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
        title="Homepage Settings"
        description="Configure homepage content and layout"
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="Hero Section">
            <div className="space-y-4">
              <Input
                label="Hero Title"
                name="hero_title"
                value={formData.hero_title}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, hero_title: '' }) }}
                placeholder="Welcome to CIDCO Mitra"
                error={errors.hero_title}
                required
              />
              <Textarea
                label="Hero Subtitle"
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => { handleChange(e); setErrors({ ...errors, hero_subtitle: '' }) }}
                rows={2}
                placeholder="Your trusted partner for..."
                error={errors.hero_subtitle}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="CTA Button Text"
                  name="hero_cta_text"
                  value={formData.hero_cta_text}
                  onChange={handleChange}
                  placeholder="Get Started"
                />
                <Input
                  label="CTA Button Link"
                  name="hero_cta_link"
                  value={formData.hero_cta_link}
                  onChange={handleChange}
                  placeholder="/contact"
                />
              </div>
            </div>
          </Card>

          <Card title="About Section">
            <div className="space-y-4">
              <Input
                label="About Title"
                name="about_title"
                value={formData.about_title}
                onChange={handleChange}
                placeholder="About Us"
              />
              <Textarea
                label="About Description"
                name="about_description"
                value={formData.about_description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell your story..."
              />
            </div>
          </Card>

          <Card title="Features Section">
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-4 border border-secondary-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-secondary-700">Feature {index + 1}</h4>
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Input
                      label="Title"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Feature title"
                    />
                    <Textarea
                      label="Description"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Feature description"
                    />
                    <Input
                      label="Icon (optional)"
                      value={feature.icon}
                      onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                      placeholder="icon-name"
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus size={16} className="mr-2" />
                Add Feature
              </Button>
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
