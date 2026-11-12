import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Contact, Download, Plus, RefreshCw, SlidersHorizontal } from 'lucide-react'
import SearchBar from '../../components/common/SearchBar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import Pagination from '../../components/tables/Pagination'
import AdvanceLeadForm from './AdvanceLeadForm'
import CaseTrackerGrid from './CaseTrackerGrid'
import CaseTrackerMobile from './CaseTrackerMobile'
import {
  CASE_STATUSES,
  CIDCO_NODES,
  SERVICE_TYPES,
  LEAD_SOURCES,
} from '../../constants/caseTracker'
import { exportCaseTrackerExcel } from '../../utils/caseTrackerExport'
import { applyCaseField } from '../../utils/caseTrackerCompute'
import { leadService } from '../../services/leadService'
import { adoService } from '../../services/adoService'
import { normalizePhoneInput, validatePhone } from '../../utils/validation'
import useDebounce from '../../hooks/useDebounce'
import useToastStore from '../../store/toastStore'

const toOptions = (list, allLabel) => [
  { value: 'all', label: allLabel },
  ...list.map((value) => ({ value, label: value })),
]

const PER_PAGE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '25', label: '25 / page' },
  { value: '50', label: '50 / page' },
  { value: '100', label: '100 / page' },
]

export default function AdvanceLeadList() {
  const { success, error } = useToastStore()
  const [rows, setRows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [caseStatus, setCaseStatus] = useState('all')
  const [cidcoNode, setCidcoNode] = useState('all')
  const [serviceType, setServiceType] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [meta, setMeta] = useState({ total: 0, last_page: 1, from: 0, to: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddAdo, setShowAddAdo] = useState(false)
  const [adoForm, setAdoForm] = useState({ name: '', contact: '' })
  const [adoErrors, setAdoErrors] = useState({})
  const [savingAdo, setSavingAdo] = useState(false)
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)
  const [showPanel, setShowPanel] = useState(false)
  const [ados, setAdos] = useState([])
  const debouncedSearch = useDebounce(searchTerm, 300)
  const savedTimerRef = useRef(null)
  const abortRef = useRef(null)
  const rowsRef = useRef([])
  const adosRef = useRef([])
  const rowsSnapshotRef = useRef(new Map())
  const saveQueueRef = useRef(new Map())
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    rowsRef.current = rows
  }, [rows])

  useEffect(() => {
    adosRef.current = ados
  }, [ados])

  const buildFilterParams = useCallback(() => {
    const params = {
      sort_by: 'date_opened',
      sort_dir: 'asc',
      use_opened_date: 1,
    }
    if (debouncedSearch) params.search = debouncedSearch
    if (caseStatus !== 'all') params.case_status = caseStatus
    if (cidcoNode !== 'all') params.cidco_node = cidcoNode
    if (serviceType !== 'all') params.service_type = serviceType
    if (sourceFilter !== 'all') params.source = sourceFilter
    return params
  }, [caseStatus, cidcoNode, debouncedSearch, serviceType, sourceFilter])

  const fetchAdos = useCallback(async () => {
    try {
      const data = await adoService.getAdos({ active_only: 1 })
      if (data?.success) setAdos(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    fetchAdos()
  }, [fetchAdos])

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, caseStatus, cidcoNode, serviceType, sourceFilter, perPage])

  const fetchCases = useCallback(async ({ soft = false } = {}) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const useSoft = soft || hasLoadedRef.current
    if (useSoft) setRefreshing(true)
    else setLoading(true)

    try {
      const params = {
        ...buildFilterParams(),
        page,
        per_page: perPage,
      }

      const data = await leadService.getLeads(params, { signal: controller.signal })
      if (controller.signal.aborted) return
      if (data?.success) {
        const pager = data.data || {}
        setRows(pager.data || [])
        setMeta({
          total: pager.total || 0,
          last_page: pager.last_page || 1,
          from: pager.from || 0,
          to: pager.to || 0,
        })
        hasLoadedRef.current = true
      }
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return
      console.error(err)
      error('Failed to load case tracker')
      if (!useSoft) {
        setRows([])
        setMeta({ total: 0, last_page: 1, from: 0, to: 0 })
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [buildFilterParams, error, page, perPage])

  useEffect(() => {
    fetchCases({ soft: hasLoadedRef.current })
    return () => abortRef.current?.abort()
  }, [fetchCases])

  const handleSaveCell = useCallback(async (id, field, value) => {
    const key = `${id}:${field}`
    const previous = rowsRef.current.find((row) => row.id === id)
    if (!previous) return

    if (!rowsSnapshotRef.current.has(key)) {
      rowsSnapshotRef.current.set(key, previous)
    }

    const payload = { [field]: value }
    let nextRow = applyCaseField(previous, field, value)

    if (field === 'ado_name') {
      const match = adosRef.current.find((ado) => ado.name === value)
      const contact = match?.contact || ''
      payload.ado_contact = contact
      nextRow = applyCaseField(nextRow, 'ado_contact', contact)
    }

    setRows((prev) => prev.map((row) => (row.id === id ? nextRow : row)))
    setSavingKey(key)

    const requestId = (saveQueueRef.current.get(key) || 0) + 1
    saveQueueRef.current.set(key, requestId)

    try {
      const response = await leadService.updateLead(id, payload, { trackerCell: true })
      if (saveQueueRef.current.get(key) !== requestId) return

      if (response?.success && response.data) {
        setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...response.data } : row)))
        setSavedKey(key)
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
        savedTimerRef.current = setTimeout(() => setSavedKey(null), 900)
        rowsSnapshotRef.current.delete(key)
      } else {
        const rollback = rowsSnapshotRef.current.get(key)
        if (rollback) {
          setRows((prev) => prev.map((row) => (row.id === id ? rollback : row)))
        }
        error(response?.message || 'Update failed')
      }
    } catch (err) {
      if (saveQueueRef.current.get(key) !== requestId) return
      const rollback = rowsSnapshotRef.current.get(key)
      if (rollback) {
        setRows((prev) => prev.map((row) => (row.id === id ? rollback : row)))
      }
      error(err.response?.data?.message || 'Failed to update cell')
    } finally {
      if (saveQueueRef.current.get(key) === requestId) {
        setSavingKey((current) => (current === key ? null : current))
        rowsSnapshotRef.current.delete(key)
      }
    }
  }, [error])

  const adoNameOptions = useMemo(() => {
    const names = new Set(ados.map((ado) => ado.name).filter(Boolean))
    rows.forEach((row) => {
      if (row.ado_name) names.add(row.ado_name)
    })
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [ados, rows])

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = {
        ...buildFilterParams(),
        page: 1,
        per_page: 500,
      }
      const data = await leadService.getLeads(params)
      const exportRows = data?.success ? (data.data.data || []) : rows
      exportCaseTrackerExcel(exportRows, 'master-case-tracker')
      success(`Exported ${exportRows.length} cases`)
    } catch (err) {
      console.error(err)
      error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const openAddAdo = () => {
    setAdoForm({ name: '', contact: '' })
    setAdoErrors({})
    setShowAddAdo(true)
  }

  const handleCreateAdo = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!adoForm.name.trim()) nextErrors.name = 'ADO name is required'
    const contactError = validatePhone(adoForm.contact, true, 'ADO Contact')
    if (contactError) nextErrors.contact = contactError
    setAdoErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSavingAdo(true)
    try {
      const response = await adoService.createAdo({
        name: adoForm.name.trim(),
        contact: adoForm.contact.trim(),
        status: true,
      })
      if (response?.success) {
        success('ADO added')
        setShowAddAdo(false)
        setAdoForm({ name: '', contact: '' })
        await fetchAdos()
      } else {
        error(response?.message || 'Failed to add ADO')
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add ADO')
    } finally {
      setSavingAdo(false)
    }
  }

  const totals = useMemo(() => rows.reduce(
    (acc, row) => {
      acc.gross += Number(row.gross_fee || 0)
      acc.exp += Number(row.total_exp || 0)
      acc.profit += Number(row.net_profit || 0)
      return acc
    },
    { gross: 0, exp: 0, profit: 0 }
  ), [rows])

  const activeFilters = [
    caseStatus !== 'all',
    cidcoNode !== 'all',
    serviceType !== 'all',
    sourceFilter !== 'all',
    Boolean(searchTerm),
  ].filter(Boolean).length

  const btnSm = 'shrink-0 !px-2.5 !py-1 !text-xs gap-1'
  const startSr = meta.from || ((page - 1) * perPage + 1)

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white shrink-0">
          Advance Lead
        </h1>
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-0.5 -mx-1 px-1">
          <Button
            size="sm"
            variant={showPanel ? 'primary' : 'ghost'}
            className={btnSm}
            onClick={() => setShowPanel((v) => !v)}
            title="Filters & totals"
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
            {activeFilters > 0 && !showPanel ? (
              <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary-100 px-1 text-[10px] font-semibold text-primary-700">
                {activeFilters}
              </span>
            ) : null}
            {showPanel ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={btnSm}
            onClick={() => fetchCases({ soft: true })}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden xs:inline sm:inline">Refresh</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={btnSm}
            onClick={handleExport}
            disabled={exporting || loading}
            title="Export Excel"
          >
            <Download size={13} />
            <span>{exporting ? 'Export…' : 'Export'}</span>
          </Button>
          <Button size="sm" variant="ghost" className={btnSm} onClick={openAddAdo} title="Add ADO">
            <Contact size={13} />
            <span>Add ADO</span>
          </Button>
          <Button size="sm" className={btnSm} onClick={() => setShowAdd(true)} title="Add Case">
            <Plus size={13} />
            <span>Add Case</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 py-2">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search name, phone, file no..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-secondary-600 dark:text-secondary-400 shrink-0">
          <span>
            <strong className="text-secondary-900 dark:text-white">{meta.total}</strong> total
          </span>
          <span className="hidden sm:inline">
            Page <strong className="text-secondary-900 dark:text-white">{page}</strong> / {meta.last_page || 1}
          </span>
          <span className={totals.profit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
            Page profit <strong>₹{totals.profit.toLocaleString('en-IN')}</strong>
          </span>
          {refreshing ? <span className="text-sky-600 dark:text-sky-400">Updating…</span> : null}
        </div>
      </div>

      {showPanel && (
        <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-2.5 sm:p-3 space-y-2.5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="rounded-md border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/60 px-2.5 py-1.5">
              <div className="text-[10px] text-secondary-500 dark:text-secondary-400">On this page</div>
              <div className="text-sm font-semibold text-secondary-900 dark:text-white">{rows.length}</div>
            </div>
            <div className="rounded-md border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/60 px-2.5 py-1.5">
              <div className="text-[10px] text-secondary-500 dark:text-secondary-400">Gross Fee (A)</div>
              <div className="text-sm font-semibold text-secondary-900 dark:text-white truncate">₹{totals.gross.toLocaleString('en-IN')}</div>
            </div>
            <div className="rounded-md border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/60 px-2.5 py-1.5">
              <div className="text-[10px] text-secondary-500 dark:text-secondary-400">Total Exp (B+C)</div>
              <div className="text-sm font-semibold text-secondary-900 dark:text-white truncate">₹{totals.exp.toLocaleString('en-IN')}</div>
            </div>
            <div className="rounded-md border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/60 px-2.5 py-1.5">
              <div className="text-[10px] text-secondary-500 dark:text-secondary-400">Net Profit</div>
              <div className={`text-sm font-semibold truncate ${totals.profit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                ₹{totals.profit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            <Select searchable value={caseStatus} onChange={(e) => setCaseStatus(e.target.value)} options={toOptions(CASE_STATUSES, 'All Status')} />
            <Select searchable value={cidcoNode} onChange={(e) => setCidcoNode(e.target.value)} options={toOptions(CIDCO_NODES, 'All Nodes')} />
            <Select searchable value={serviceType} onChange={(e) => setServiceType(e.target.value)} options={toOptions(SERVICE_TYPES, 'All Services')} />
            <Select searchable value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} options={toOptions(LEAD_SOURCES, 'All Sources')} />
          </div>
        </div>
      )}

      {/* Desktop / tablet spreadsheet */}
      <div className="hidden md:block">
        <CaseTrackerGrid
          rows={rows}
          loading={loading}
          savingKey={savingKey}
          savedKey={savedKey}
          onSaveCell={handleSaveCell}
          startSr={startSr}
          compact={!showPanel}
          columnOptions={{ ado_name: adoNameOptions }}
        />
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden">
        <CaseTrackerMobile
          rows={rows}
          loading={loading}
          startSr={startSr}
          adoOptions={adoNameOptions}
          onSaveCell={handleSaveCell}
          savingKey={savingKey}
        />
      </div>

      {meta.total > 0 && (
        <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 py-2 border-b border-secondary-100 dark:border-secondary-700">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              Showing {meta.from || 0}–{meta.to || 0} of {meta.total}
            </p>
            <div className="w-full sm:w-40">
              <Select
                value={String(perPage)}
                onChange={(e) => setPerPage(Number(e.target.value))}
                options={PER_PAGE_OPTIONS}
              />
            </div>
          </div>
          <Pagination
            currentPage={page}
            totalPages={meta.last_page || 1}
            onPageChange={setPage}
            totalItems={meta.total}
            itemsPerPage={perPage}
          />
        </div>
      )}

      <AdvanceLeadForm
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setPage(1)
          fetchCases({ soft: true })
        }}
        ados={ados}
      />

      <Modal
        isOpen={showAddAdo}
        onClose={() => !savingAdo && setShowAddAdo(false)}
        title="Add ADO"
        size="sm"
      >
        <form onSubmit={handleCreateAdo} className="space-y-4">
          <Input
            label="ADO Name"
            name="name"
            value={adoForm.name}
            onChange={(e) => {
              setAdoForm((prev) => ({ ...prev, name: e.target.value }))
              setAdoErrors((prev) => ({ ...prev, name: '' }))
            }}
            error={adoErrors.name}
            required
          />
          <Input
            label="ADO Contact"
            name="contact"
            value={adoForm.contact}
            onChange={(e) => {
              setAdoForm((prev) => ({ ...prev, contact: normalizePhoneInput(e.target.value) }))
              setAdoErrors((prev) => ({ ...prev, contact: '' }))
            }}
            error={adoErrors.contact}
            inputMode="numeric"
            maxLength={10}
            minLength={10}
            placeholder="10-digit mobile"
            required
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddAdo(false)} disabled={savingAdo}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={savingAdo}>
              {savingAdo ? 'Saving...' : 'Save ADO'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
