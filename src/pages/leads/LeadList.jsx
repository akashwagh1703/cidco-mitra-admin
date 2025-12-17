import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, Download } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Table from '../../components/tables/Table'
import Pagination from '../../components/tables/Pagination'
import { LEAD_STATUS, LEAD_STATUS_CONFIG } from '../../constants/leadStatus'
import { formatDate } from '../../utils/formatters'
import { leadService } from '../../services/leadService'
import useDebounce from '../../hooks/useDebounce'

export default function LeadList() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    fetchLeads()
  }, [currentPage, statusFilter, debouncedSearch, dateFrom, dateTo, sourceFilter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: 10
      }
      
      if (debouncedSearch) {
        params.search = debouncedSearch
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      if (sourceFilter && sourceFilter !== 'all') {
        params.source = sourceFilter
      }
      
      if (dateFrom) {
        params.date_from = dateFrom
      }
      
      if (dateTo) {
        params.date_to = dateTo
      }

      const data = await leadService.getLeads(params)
      
      if (data?.success) {
        setLeads(data.data.data || [])
        setTotalPages(data.data.last_page || 1)
        setTotalItems(data.data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = {}
      
      if (debouncedSearch) {
        params.search = debouncedSearch
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      if (sourceFilter && sourceFilter !== 'all') {
        params.source = sourceFilter
      }
      
      if (dateFrom) {
        params.date_from = dateFrom
      }
      
      if (dateTo) {
        params.date_to = dateTo
      }

      const data = await leadService.exportLeads(params)
      
      if (data) {
        // Create blob and download
        const blob = new Blob([data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export leads:', error)
      alert('Failed to export leads. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source' },
    {
      key: 'status',
      label: 'Status',
      render: (lead) => {
        const config = LEAD_STATUS_CONFIG[lead.status]
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (lead) => formatDate(lead.createdAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (lead) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/leads/${lead.id}`)}
        >
          View
        </Button>
      )
    }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    ...Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => ({
      value: key,
      label: config.label
    }))
  ]
  
  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'Website', label: 'Website' },
    { value: 'Phone', label: 'Phone' },
    { value: 'Email', label: 'Email' },
    { value: 'Walk-in', label: 'Walk-in' },
    { value: 'Referral', label: 'Referral' }
  ]
  
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setSourceFilter('all')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  return (
    <div>
      <PageHeader
        title="Lead Management"
        description="Manage and track all leads"
      />

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, email, or phone..."
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
          <Button 
            variant={showMoreFilters ? 'primary' : 'ghost'}
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            <Filter size={16} className="mr-2" />
            {showMoreFilters ? 'Hide Filters' : 'More Filters'}
          </Button>
          <Button variant="ghost" onClick={handleExport} disabled={exporting}>
            <Download size={16} className="mr-2" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>

        {showMoreFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <Select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                options={sourceOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={clearFilters}>
                Clear All Filters
              </Button>
              <Button onClick={() => setShowMoreFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <Table columns={columns} data={leads} />
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={10}
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}
