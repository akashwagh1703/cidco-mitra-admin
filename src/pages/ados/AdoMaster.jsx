import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import SearchBar from '../../components/common/SearchBar'
import { adoService } from '../../services/adoService'
import { normalizePhoneInput, validatePhone } from '../../utils/validation'
import useDebounce from '../../hooks/useDebounce'
import useToastStore from '../../store/toastStore'

const EMPTY_FORM = { name: '', contact: '', status: true }

export default function AdoMaster() {
  const { success, error } = useToastStore()
  const [ados, setAdos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchAdos = async () => {
    setLoading(true)
    try {
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      const data = await adoService.getAdos(params)
      if (data?.success) setAdos(data.data || [])
    } catch (err) {
      error('Failed to load ADO master')
      setAdos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdos()
  }, [debouncedSearch])

  const openCreate = () => {
    setSelected(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (ado) => {
    setSelected(ado)
    setForm({
      name: ado.name || '',
      contact: ado.contact || '',
      status: ado.status !== false,
    })
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'ADO name is required'
    const contactError = validatePhone(form.contact, true, 'ADO Contact')
    if (contactError) next.contact = contactError
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        contact: form.contact.trim() || null,
        status: Boolean(form.status),
      }
      const response = selected
        ? await adoService.updateAdo(selected.id, payload)
        : await adoService.createAdo(payload)

      if (response?.success) {
        success(selected ? 'ADO updated' : 'ADO created')
        setShowModal(false)
        setSelected(null)
        setForm(EMPTY_FORM)
        fetchAdos()
      } else {
        error(response?.message || 'Save failed')
      }
    } catch (err) {
      error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selected) return
    try {
      const response = await adoService.deleteAdo(selected.id)
      if (response?.success) {
        success('ADO deleted')
        fetchAdos()
      } else {
        error(response?.message || 'Delete failed')
      }
    } catch (err) {
      error(err.response?.data?.message || 'Delete failed')
    } finally {
      setShowDelete(false)
      setSelected(null)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="ADO Master"
        description="Manage ADO names and contacts used in Advance Lead tracker"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} className="mr-2" />
            Add ADO
          </Button>
        }
      />

      <Card>
        <div className="mb-4 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search ADO name or contact..." />
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-secondary-500 dark:text-secondary-400">Loading...</div>
        ) : ados.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No ADOs yet"
            description='Click "Add ADO" to create one.'
            action={
              <Button onClick={openCreate}>
                <Plus size={16} className="mr-2" />
                Add ADO
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700 text-left text-secondary-500 dark:text-secondary-400">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">ADO Name</th>
                  <th className="px-3 py-2 font-medium">ADO Contact</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ados.map((ado, idx) => (
                  <tr key={ado.id} className="border-b border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                    <td className="px-3 py-2 text-secondary-500 dark:text-secondary-400">{idx + 1}</td>
                    <td className="px-3 py-2 font-medium text-secondary-900 dark:text-white">{ado.name}</td>
                    <td className="px-3 py-2 text-secondary-700 dark:text-secondary-300">{ado.contact || '—'}</td>
                    <td className="px-3 py-2">
                      <Badge variant={ado.status ? 'success' : 'danger'}>
                        {ado.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => openEdit(ado)} title="Edit">
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelected(ado)
                            setShowDelete(true)
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => !saving && setShowModal(false)}
        title={selected ? 'Edit ADO' : 'Add ADO'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ADO Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
          />
          <Input
            label="ADO Contact"
            name="contact"
            value={form.contact}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, contact: normalizePhoneInput(e.target.value) }))
              setErrors((prev) => ({ ...prev, contact: '' }))
            }}
            error={errors.contact}
            inputMode="numeric"
            maxLength={10}
            minLength={10}
            placeholder="10-digit mobile"
            required
          />
          <Select
            searchable
            label="Status"
            name="status"
            value={form.status ? '1' : '0'}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value === '1' }))}
            options={[
              { value: '1', label: 'Active' },
              { value: '0', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : selected ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Delete ADO"
        message={`Delete "${selected?.name}"? Existing cases keep their saved ADO values.`}
      />
    </div>
  )
}
