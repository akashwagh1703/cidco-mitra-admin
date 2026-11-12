import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import useAuthStore from '../../store/authStore'
import useToastStore from '../../store/toastStore'
import { validateEmail, validatePassword } from '../../utils/validation'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isInitializing } = useAuthStore()
  const { success, error } = useToastStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
        <div className="text-secondary-600 dark:text-secondary-300 text-sm">Loading session...</div>
      </div>
    )
  }

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})
    // Drop any stale token so login isn't blocked by a queued /auth/me on artisan serve
    localStorage.removeItem('token')

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl p-8 border border-secondary-100 dark:border-secondary-700 transition-colors duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">CM</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">CIDCO Mitra</h1>
            <p className="text-secondary-600 dark:text-secondary-400">Admin Panel Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className={`
                    w-full px-3 py-2 pr-10 border rounded-lg text-sm
                    bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    transition-colors placeholder:text-secondary-400 dark:placeholder:text-secondary-500
                    ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-secondary-300 dark:border-secondary-600'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
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
        </div>

        <p className="text-center text-sm text-secondary-500 dark:text-secondary-500 mt-8">
          © {new Date().getFullYear()} CIDCO Mitra. All rights reserved.
        </p>
      </div>
    </div>
  )
}
