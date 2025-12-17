import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table from '../../components/tables/Table'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import useToastStore from '../../store/toastStore'
import { userService } from '../../services/userService'
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation'

export default function Users() {
  const { success, error } = useToastStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Agent', status: true })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (err) {
      error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData(user)
    setShowModal(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const validate = () => {
    const newErrors = {}
    const nameError = validateRequired(formData.name, 'Name')
    const emailError = validateEmail(formData.email)
    const passwordError = !selectedUser ? validatePassword(formData.password) : ''
    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (selectedUser) {
        const response = await userService.updateUser(selectedUser.id, formData)
        if (response.success) {
          success('User updated successfully')
          fetchUsers()
        }
      } else {
        const response = await userService.createUser(formData)
        if (response.success) {
          success('User added successfully')
          fetchUsers()
        }
      }
      setShowModal(false)
      setSelectedUser(null)
      setFormData({ name: '', email: '', password: '', role: 'Agent', status: true })
      setErrors({})
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed')
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await userService.deleteUser(selectedUser.id)
      if (response.success) {
        success('User deleted successfully')
        fetchUsers()
      }
    } catch (err) {
      error('Failed to delete user')
    } finally {
      setShowDeleteDialog(false)
      setSelectedUser(null)
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <Badge variant={user.status === 'active' ? 'success' : 'default'}>
          {user.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(user)}>
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      )
    }
  ]

  const roleOptions = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Agent', label: 'Agent' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage system users and their access"
        action={
          <Button onClick={() => { setSelectedUser(null); setShowModal(true) }}>
            <Plus size={16} className="mr-2" />
            Add User
          </Button>
        }
      />

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Table columns={columns} data={users} />
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedUser ? 'Edit User' : 'Add User'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
            placeholder="Enter name"
            error={errors.name}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
            placeholder="Enter email"
            error={errors.email}
            required
          />
          {!selectedUser && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
              placeholder="Enter password"
              error={errors.password}
              required
            />
          )}
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={roleOptions}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {selectedUser ? 'Update' : 'Add'} User
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
