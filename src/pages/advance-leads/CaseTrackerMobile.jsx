import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { CASE_STATUSES, CASE_STATUS_COLORS, CIDCO_NODES, SERVICE_TYPES } from '../../constants/caseTracker'
import { normalizePhoneInput, validatePhone } from '../../utils/validation'

const toOptions = (list) => list.map((value) => ({ value, label: value }))

function MobileCaseCard({
  row,
  sr,
  adoOptions,
  onSaveCell,
  savingKey,
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({})
  const [errors, setErrors] = useState({})

  const statusClass = CASE_STATUS_COLORS[row.case_status] || 'bg-slate-100 text-slate-800'
  const days = Number(row.days_open)
  const aging =
    row.case_status === 'Completed' || Number.isNaN(days)
      ? ''
      : days > 90
        ? 'border-l-4 border-l-rose-500'
        : days > 60
          ? 'border-l-4 border-l-orange-500'
          : days > 30
            ? 'border-l-4 border-l-amber-500'
            : ''

  const startEdit = () => {
    setDraft({
      phone: normalizePhoneInput(row.phone || ''),
      ado_name: row.ado_name || '',
      ado_contact: normalizePhoneInput(row.ado_contact || ''),
      case_status: row.case_status || '',
      cidco_node: row.cidco_node || '',
      service_type: row.service_type || '',
      gross_fee: row.gross_fee ?? '',
      paper_office_exp: row.paper_office_exp ?? '',
      cidco_fees: row.cidco_fees ?? '',
      next_action_item: row.next_action_item || '',
    })
    setErrors({})
    setOpen(true)
  }

  const saveField = async (field, value) => {
    if (field === 'phone' || field === 'ado_contact') {
      const err = validatePhone(value, false, field === 'phone' ? 'Contact No' : 'ADO Contact')
      if (err) {
        setErrors((prev) => ({ ...prev, [field]: err }))
        return
      }
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    const current = row[field] ?? ''
    if (String(current) === String(value ?? '')) return
    await onSaveCell(row.id, field, value)
  }

  const adoSelectOptions = [
    { value: '', label: 'Select ADO' },
    ...adoOptions.map((name) => ({ value: name, label: name })),
  ]

  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${aging}`}>
      <button
        type="button"
        className="w-full text-left px-3 py-2.5"
        onClick={() => (open ? setOpen(false) : startEdit())}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">#{sr}</span>
              <h3 className="font-semibold text-sm text-slate-900 truncate">{row.name || '—'}</h3>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
              <span className={`px-1.5 py-0.5 rounded ${statusClass}`}>{row.case_status || '—'}</span>
              {row.phone ? <span>{row.phone}</span> : null}
              {row.cidco_node ? <span>· {row.cidco_node}</span> : null}
              {row.days_open != null ? <span>· {row.days_open}d</span> : null}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-sm font-semibold ${Number(row.net_profit) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₹{Number(row.net_profit || 0).toLocaleString('en-IN')}
            </div>
            {open ? <ChevronUp size={16} className="ml-auto text-slate-400" /> : <ChevronDown size={16} className="ml-auto text-slate-400" />}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-3 py-3 space-y-2.5 bg-slate-50/60">
          <Select
            searchable
            label="Status"
            value={draft.case_status}
            options={toOptions(CASE_STATUSES)}
            onChange={(e) => {
              const value = e.target.value
              setDraft((p) => ({ ...p, case_status: value }))
              void saveField('case_status', value)
            }}
          />
          <div className="grid grid-cols-1 gap-2">
            <Input
              label="Contact No"
              value={draft.phone}
              inputMode="numeric"
              maxLength={10}
              error={errors.phone}
              onChange={(e) => setDraft((p) => ({ ...p, phone: normalizePhoneInput(e.target.value) }))}
              onBlur={() => saveField('phone', draft.phone || '')}
            />
            <Select
              searchable
              label="ADO Name"
              value={draft.ado_name}
              options={adoSelectOptions}
              onChange={(e) => {
                const value = e.target.value
                setDraft((p) => ({ ...p, ado_name: value }))
                void saveField('ado_name', value)
              }}
            />
            <Input
              label="ADO Contact"
              value={draft.ado_contact}
              inputMode="numeric"
              maxLength={10}
              error={errors.ado_contact}
              onChange={(e) => setDraft((p) => ({ ...p, ado_contact: normalizePhoneInput(e.target.value) }))}
              onBlur={() => saveField('ado_contact', draft.ado_contact || '')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Select
              searchable
              label="CIDCO Node"
              value={draft.cidco_node}
              options={[{ value: '', label: 'Select' }, ...toOptions(CIDCO_NODES)]}
              onChange={(e) => {
                const value = e.target.value
                setDraft((p) => ({ ...p, cidco_node: value }))
                void saveField('cidco_node', value)
              }}
            />
            <Select
              searchable
              label="Service Type"
              value={draft.service_type}
              options={[{ value: '', label: 'Select' }, ...toOptions(SERVICE_TYPES)]}
              onChange={(e) => {
                const value = e.target.value
                setDraft((p) => ({ ...p, service_type: value }))
                void saveField('service_type', value)
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Gross (A)"
              type="number"
              value={draft.gross_fee}
              onChange={(e) => setDraft((p) => ({ ...p, gross_fee: e.target.value }))}
              onBlur={() => saveField('gross_fee', draft.gross_fee === '' ? 0 : Number(draft.gross_fee))}
            />
            <Input
              label="Exp (B)"
              type="number"
              value={draft.paper_office_exp}
              onChange={(e) => setDraft((p) => ({ ...p, paper_office_exp: e.target.value }))}
              onBlur={() => saveField('paper_office_exp', draft.paper_office_exp === '' ? 0 : Number(draft.paper_office_exp))}
            />
            <Input
              label="CIDCO (C)"
              type="number"
              value={draft.cidco_fees}
              onChange={(e) => setDraft((p) => ({ ...p, cidco_fees: e.target.value }))}
              onBlur={() => saveField('cidco_fees', draft.cidco_fees === '' ? 0 : Number(draft.cidco_fees))}
            />
          </div>
          <Input
            label="Next Action"
            value={draft.next_action_item}
            onChange={(e) => setDraft((p) => ({ ...p, next_action_item: e.target.value }))}
            onBlur={() => saveField('next_action_item', draft.next_action_item)}
          />
          {savingKey?.startsWith(`${row.id}:`) ? (
            <p className="text-[11px] text-sky-600">Saving…</p>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default function CaseTrackerMobile({
  rows,
  loading,
  startSr = 1,
  adoOptions = [],
  onSaveCell,
  savingKey,
}) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
        Loading cases...
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
        No cases yet. Tap &quot;Add Case&quot; to create one.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rows.map((row, idx) => (
        <MobileCaseCard
          key={row.id}
          row={row}
          sr={startSr + idx}
          adoOptions={adoOptions}
          onSaveCell={onSaveCell}
          savingKey={savingKey}
        />
      ))}
    </div>
  )
}
