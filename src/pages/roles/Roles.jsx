import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import useToastStore from '../../store/toastStore'
import { roleService } from '../../services/roleService'
import { validateRequired } from '../../utils/validation'

export default function Roles() {
  const { success, error } = useToastStore()
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({ name: '', permissions: [] })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions()
      ])

      if (rolesRes.success) {
        setRoles(rolesRes.data)
      }

      if (permsRes.success) {
        setPermissions(permsRes.data)
      }
    } catch (err) {
      error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (role) => {
    setSelectedRole(role)
    setFormData({ name: role.name, permissions: role.permissions })
    setShowModal(true)
  }

  const handleDelete = (role) => {
    setSelectedRole(role)
    setShowDeleteDialog(true)
  }

  const validate = () => {
    const newErrors = {}
    const nameError = validateRequired(formData.name, 'Role name')
    if (nameError) newErrors.name = nameError
    if (formData.permissions.length === 0) newErrors.permissions = 'Select at least one permission'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      if (selectedRole) {
        const response = await roleService.updateRole(selectedRole.id, formData)
        if (response.success) {
          success('Role updated successfully')
          fetchData()
        }
      } else {
        const response = await roleService.createRole(formData)
        if (response.success) {
          success('Role created successfully')
          fetchData()
        }
      }
      setShowModal(false)
      setSelectedRole(null)
      setFormData({ name: '', permissions: [] })
      setErrors({})
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed')
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await roleService.deleteRole(selectedRole.id)
      if (response.success) {
        success('Role deleted successfully')
        fetchData()
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete role')
    } finally {
      setShowDeleteDialog(false)
      setSelectedRole(null)
    }
  }

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  return (
    <div>
      <PageHeader
        title="Role Management"
        description="Manage roles and permissions"
        action={
          <Button onClick={() => { setSelectedRole(null); setFormData({ name: '', permissions: [] }); setShowModal(true) }}>
            <Plus size={16} className="mr-2" />
            Add Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} title={role.name}>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-2">Permissions:</p>
                <div className="space-y-1">
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <div key={permission.id || permission.name} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <span className="text-sm text-secondary-600">
                          {permission.name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-secondary-500">No permissions assigned</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-secondary-200">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(role)} className="flex-1">
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(role)} className="flex-1">
                  <Trash2 size={14} className="mr-1 text-red-600" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRole ? 'Edit Role' : 'Add Role'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Role Name"
            value={formData.name}
            onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
            placeholder="Enter role name"
            error={errors.name}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">Permissions</label>
            {errors.permissions && <p className="text-sm text-red-600 mb-2">{errors.permissions}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 p-3 border border-secondary-200 rounded-md hover:bg-secondary-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.name)}
                    onChange={() => togglePermission(permission.name)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-900">
                    {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {selectedRole ? 'Update' : 'Create'} Role
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete ${selectedRole?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
