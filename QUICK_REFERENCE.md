# CIDCO Mitra Admin Panel - Quick Reference Guide

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server (Port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Default Login

```
Email: admin@cidcomitra.gov.in
Password: admin123
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component |
| `src/main.jsx` | Entry point |
| `src/router/AppRouter.jsx` | All routes |
| `src/store/authStore.js` | Authentication state |
| `tailwind.config.js` | Theme configuration |
| `.env` | Environment variables |

## 🎨 Component Quick Reference

### Import Components

```jsx
// UI Components
import { Button, Input, Card, Modal } from '../components/ui'

// Common Components
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'

// Table Components
import Table from '../components/tables/Table'
import Pagination from '../components/tables/Pagination'
```

### Button Usage

```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Input Usage

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="Enter email"
/>
```

### Card Usage

```jsx
<Card title="Card Title" action={<Button>Action</Button>}>
  Card content here
</Card>
```

### Modal Usage

```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>
```

### Toast Usage

```jsx
import useToastStore from '../store/toastStore'

const { success, error, info, warning } = useToastStore()

success('Operation successful!')
error('Something went wrong')
info('Information message')
warning('Warning message')
```

## 🔒 Permission Check

```jsx
import useAuthStore from '../store/authStore'
import { PERMISSIONS } from '../constants/permissions'

const { hasPermission } = useAuthStore()

// Check permission
if (hasPermission(PERMISSIONS.MANAGE_LEADS)) {
  // Show component
}

// In JSX
{hasPermission(PERMISSIONS.MANAGE_USERS) && (
  <Button>Add User</Button>
)}
```

## 🛣️ Route Protection

```jsx
// Protect route with permission
<Route path="/users" element={
  <RoleGuard permission={PERMISSIONS.MANAGE_USERS}>
    <Users />
  </RoleGuard>
} />
```

## 📊 Available Permissions

```javascript
PERMISSIONS.VIEW_DASHBOARD
PERMISSIONS.MANAGE_LEADS
PERMISSIONS.UPDATE_LEAD_STATUS
PERMISSIONS.VIEW_NOTIFICATIONS
PERMISSIONS.MANAGE_WEBSITE_SETTINGS
PERMISSIONS.MANAGE_EMAIL_SETTINGS
PERMISSIONS.MANAGE_USERS
PERMISSIONS.MANAGE_ROLES
PERMISSIONS.ACCESS_REPORTS
```

## 🎨 Tailwind Classes Quick Reference

### Colors

```jsx
// Primary
bg-primary-600 text-primary-600 border-primary-600

// Secondary
bg-secondary-600 text-secondary-600 border-secondary-600

// Status
bg-green-600 text-green-600  // Success
bg-yellow-600 text-yellow-600  // Warning
bg-red-600 text-red-600  // Danger
```

### Spacing

```jsx
p-4   // padding: 16px
m-4   // margin: 16px
gap-4 // gap: 16px

px-6  // padding-left & right: 24px
py-4  // padding-top & bottom: 16px
```

### Layout

```jsx
flex items-center justify-between
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

## 📝 Creating New Page

```jsx
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function NewPage() {
  return (
    <div>
      <PageHeader
        title="Page Title"
        description="Page description"
        action={<Button>Action</Button>}
      />

      <Card>
        Page content
      </Card>
    </div>
  )
}
```

## 🔄 State Management

### Auth Store

```jsx
import useAuthStore from '../store/authStore'

const { user, isAuthenticated, login, logout } = useAuthStore()
```

### Notification Store

```jsx
import useNotificationStore from '../store/notificationStore'

const { notifications, unreadCount, markAsRead } = useNotificationStore()
```

### Toast Store

```jsx
import useToastStore from '../store/toastStore'

const { success, error, info, warning } = useToastStore()
```

### UI Store

```jsx
import useUIStore from '../store/uiStore'

const { sidebarCollapsed, toggleSidebar } = useUIStore()
```

## 🌐 API Service

```jsx
import api from '../services/api'

// GET request
const data = await api.get('/endpoint')

// POST request
const result = await api.post('/endpoint', { data })

// PUT request
const updated = await api.put('/endpoint/:id', { data })

// DELETE request
await api.delete('/endpoint/:id')
```

## 🎯 Lead Status

```javascript
import { LEAD_STATUS, LEAD_STATUS_CONFIG } from '../constants/leadStatus'

LEAD_STATUS.NEW
LEAD_STATUS.CONTACTED
LEAD_STATUS.FOLLOW_UP
LEAD_STATUS.CONVERTED
LEAD_STATUS.NOT_INTERESTED

// Get status config
const config = LEAD_STATUS_CONFIG[status]
// Returns: { label, color, dotColor }
```

## 📱 Responsive Breakpoints

```jsx
// Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">

// Hide on mobile
<div className="hidden md:block">

// Show only on mobile
<div className="block md:hidden">
```

## 🔍 Common Patterns

### Form Handling

```jsx
const [formData, setFormData] = useState({ name: '', email: '' })

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value })
}

const handleSubmit = (e) => {
  e.preventDefault()
  // Handle form submission
}
```

### Table with Pagination

```jsx
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10

<Table columns={columns} data={data} />
<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(data.length / itemsPerPage)}
  onPageChange={setCurrentPage}
  totalItems={data.length}
  itemsPerPage={itemsPerPage}
/>
```

### Search with Debounce

```jsx
import useDebounce from '../hooks/useDebounce'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // Perform search with debouncedSearch
}, [debouncedSearch])
```

## 🐛 Debugging Tips

### Check Auth State

```javascript
// In browser console
localStorage.getItem('auth-storage')
```

### Check Current Route

```javascript
// In component
import { useLocation } from 'react-router-dom'
const location = useLocation()
console.log(location.pathname)
```

### Check Permissions

```javascript
// In browser console
const authStore = JSON.parse(localStorage.getItem('auth-storage'))
console.log(authStore.state.user.permissions)
```

## 📞 Need Help?

1. Check documentation files (README.md, SETUP.md, FEATURES.md)
2. Review existing code patterns
3. Check browser console for errors
4. Contact development team

## 🎉 Tips & Tricks

- Use `Ctrl+Shift+F` to search across all files
- Use React DevTools for debugging
- Check Network tab for API issues
- Use Tailwind IntelliSense extension in VS Code
- Keep components small and focused
- Reuse existing components when possible
- Follow existing code patterns
- Test on different screen sizes

---

**Quick Links**
- [Full Documentation](README.md)
- [Setup Guide](SETUP.md)
- [Features](FEATURES.md)
- [Deployment](DEPLOYMENT.md)
