import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuthStore from '../../store/authStore'
import useToastStore from '../../store/toastStore'
import { validateEmail, validatePassword } from '../../utils/validation'
import { DEFAULT_ROLES, PERMISSIONS } from '../../constants/permissions'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { success, error } = useToastStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const fillCredentials = (email, password) => {
    setFormData({ email, password })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})
    
    try {
      const { authService } = await import('../../services/authService')
      const response = await authService.login(formData.email, formData.password)
      
      if (response.success || response.token) {
        login(response.user || response.data)
        success('Login successful!')
        navigate('/dashboard')
      } else {
        const errorMsg = response.message || 'Invalid credentials. Please check your email and password.'
        error(errorMsg)
        setErrors({ submit: errorMsg })
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.message || 
                      'Login failed. Please check your credentials and try again.'
      error(errorMsg)
      setErrors({ submit: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-secondary-100 dark:border-gray-700 transition-colors duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">CM</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">CIDCO Mitra</h1>
            <p className="text-secondary-600 dark:text-gray-400">Admin Panel Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@cidcomitra.gov.in"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-secondary-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-secondary-600 dark:text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Forgot password?
              </button>
            </div>

            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-3 text-center">Test Credentials (Click to use)</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@cidcomitra.gov.in', 'admin123')}
                  className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-900 dark:text-blue-200">Super Admin</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">admin@cidcomitra.gov.in</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('priya.sharma@cidcomitra.gov.in', 'password123')}
                  className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-900 dark:text-blue-200">Admin</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">priya.sharma@cidcomitra.gov.in</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('amit.patel@cidcomitra.gov.in', 'password123')}
                  className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-900 dark:text-blue-200">Manager</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">amit.patel@cidcomitra.gov.in</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('sneha.desai@cidcomitra.gov.in', 'password123')}
                  className="w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-900 dark:text-blue-200">Agent</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">sneha.desai@cidcomitra.gov.in</span>
                  </div>
                </button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              💡 Click any credential above to auto-fill the login form
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-secondary-500 dark:text-gray-500 mt-8">
          © 2024 CIDCO Mitra. All rights reserved.
        </p>
      </div>
    </div>
  )
}
