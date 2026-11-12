import { useMemo, useState } from 'react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Button from '../../components/ui/Button'
import {
  CASE_STATUSES,
  CIDCO_NODES,
  SERVICE_TYPES,
  LEAD_SOURCES,
} from '../../constants/caseTracker'
import { leadService } from '../../services/leadService'
import { normalizePhoneInput, validatePhone } from '../../utils/validation'
import useToastStore from '../../store/toastStore'

const toOptions = (list) => list.map((value) => ({ value, label: value }))

const today = () => new Date().toISOString().slice(0, 10)

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  date_opened: today(),
  client_location: '',
  cidco_node: '',
  ado_name: '',
  ado_contact: '',
  cfc_file_no: '',
  service_type: '',
  source: 'Admin',
  case_status: 'In-Process at CIDCO',
  gross_fee: '',
  paper_office_exp: '',
  cidco_fees: '',
  next_action_date: '',
  next_action_item: '',
  message: '',
}

export default function AdvanceLeadForm({ isOpen, onClose, onSuccess, ados = [] }) {
  const { success, error } = useToastStore()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const adoOptions = useMemo(() => [
    { value: '', label: ados.length ? 'Select ADO' : 'No ADOs in master — add from ADO Master' },
    ...ados.map((ado) => ({ value: ado.name, label: ado.name })),
  ], [ados])

  const handleChange = (e) => {
    const { name, value } = e.target
    const nextValue = (name === 'phone' || name === 'ado_contact')
      ? normalizePhoneInput(value)
      : value
    setForm((prev) => ({ ...prev, [name]: nextValue }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleAdoChange = (e) => {
    const name = e.target.value
    const match = ados.find((ado) => ado.name === name)
    setForm((prev) => ({
      ...prev,
      ado_name: name,
      ado_contact: match?.contact ? normalizePhoneInput(match.contact) : '',
    }))
    setErrors((prev) => ({ ...prev, ado_name: '', ado_contact: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Customer name is required'
    if (!form.date_opened) next.date_opened = 'Date opened is required'
    const phoneError = validatePhone(form.phone, false, 'Contact No')
    if (phoneError) next.phone = phoneError
    const adoContactError = validatePhone(form.ado_contact, false, 'ADO Contact')
    if (adoContactError) next.ado_contact = adoContactError
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleClose = () => {
    if (submitting) return
    setForm({ ...INITIAL_FORM, date_opened: today() })
    setErrors({})
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim() || '',
        email: form.email.trim() || null,
        ado_contact: form.ado_contact.trim() || null,
        gross_fee: form.gross_fee === '' ? 0 : Number(form.gross_fee),
        paper_office_exp: form.paper_office_exp === '' ? 0 : Number(form.paper_office_exp),
        cidco_fees: form.cidco_fees === '' ? 0 : Number(form.cidco_fees),
        next_action_date: form.next_action_date || null,
        status: 'new',
      }

      const response = await leadService.createLead(payload)
      if (response?.success) {
        success('Case added to tracker')
        setForm({ ...INITIAL_FORM, date_opened: today() })
        setErrors({})
        onSuccess?.(response.data)
        onClose()
      } else {
        error(response?.message || 'Failed to create case')
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create case')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Case" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Date Opened" type="date" name="date_opened" value={form.date_opened} onChange={handleChange} error={errors.date_opened} required />
          <Input label="Customer Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
          <Input
            label="Contact No"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            inputMode="numeric"
            maxLength={10}
            minLength={10}
            placeholder="10-digit mobile"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Client Location" name="client_location" value={form.client_location} onChange={handleChange} />
          <Select searchable label="CIDCO Node" name="cidco_node" value={form.cidco_node} onChange={handleChange} options={[{ value: '', label: 'Select node' }, ...toOptions(CIDCO_NODES)]} />
          <Select searchable label="Service Type" name="service_type" value={form.service_type} onChange={handleChange} options={[{ value: '', label: 'Select service' }, ...toOptions(SERVICE_TYPES)]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            searchable
            label="ADO Name"
            name="ado_name"
            value={form.ado_name}
            onChange={handleAdoChange}
            options={adoOptions}
          />
          <Input
            label="ADO Contact"
            name="ado_contact"
            value={form.ado_contact}
            onChange={handleChange}
            error={errors.ado_contact}
            inputMode="numeric"
            maxLength={10}
            minLength={10}
            placeholder="10-digit (auto-filled)"
          />
          <Input label="CFC/File No" name="cfc_file_no" value={form.cfc_file_no} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select searchable label="Lead Source" name="source" value={form.source} onChange={handleChange} options={toOptions(LEAD_SOURCES)} />
          <Select searchable label="Current Status" name="case_status" value={form.case_status} onChange={handleChange} options={toOptions(CASE_STATUSES)} />
          <Input label="Email (optional)" type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Gross Fee (A)" type="number" name="gross_fee" value={form.gross_fee} onChange={handleChange} min="0" step="0.01" />
          <Input label="Paper/Office Exp (B)" type="number" name="paper_office_exp" value={form.paper_office_exp} onChange={handleChange} min="0" step="0.01" />
          <Input label="CIDCO Fees (C)" type="number" name="cidco_fees" value={form.cidco_fees} onChange={handleChange} min="0" step="0.01" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Next Action Date" type="date" name="next_action_date" value={form.next_action_date} onChange={handleChange} />
          <Input label="Next Action Item" name="next_action_item" value={form.next_action_item} onChange={handleChange} />
        </div>

        <Textarea label="Notes" name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Optional notes..." />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Add Case'}</Button>
        </div>
      </form>
    </Modal>
  )
}
