import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import Button from '../ui/Button'

export default function FileUpload({ label, accept = 'image/*', maxSize = 2, onChange, preview, name }) {
  const [previewUrl, setPreviewUrl] = useState(preview || null)
  const [error, setError] = useState('')
  
  // Update preview when prop changes
  useEffect(() => {
    setPreviewUrl(preview || null)
  }, [preview])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setError('')
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)

    // Pass file to parent
    if (onChange) {
      onChange(file, name)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setError('')
    if (onChange) {
      onChange(null, name)
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      
      {previewUrl ? (
        <div className="relative inline-block">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="h-32 w-32 object-cover rounded-lg border-2 border-secondary-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
          <Upload className="mx-auto text-secondary-400 mb-2" size={32} />
          <p className="text-sm text-secondary-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-secondary-500 mb-3">
            Max size: {maxSize}MB
          </p>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`file-${name}`}
          />
          <label htmlFor={`file-${name}`} className="cursor-pointer">
            <Button type="button" size="sm" variant="ghost" as="span">
              Choose File
            </Button>
          </label>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
}
