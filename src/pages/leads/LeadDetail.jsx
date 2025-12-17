import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { LEAD_STATUS, LEAD_STATUS_CONFIG } from '../../constants/leadStatus'
import { formatDateTime } from '../../utils/formatters'
import useToastStore from '../../store/toastStore'
import { leadService } from '../../services/leadService'

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToastStore()
  const [lead, setLead] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeadDetails()
  }, [id])

  const fetchLeadDetails = async () => {
    try {
      const response = await leadService.getLead(id)
      if (response.success) {
        setLead(response.data)
      }
    } catch (err) {
      error('Failed to fetch lead details')
      navigate('/leads')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await leadService.updateLeadStatus(id, newStatus)
      if (response.success) {
        setLead({ ...lead, status: newStatus })
        success('Lead status updated successfully')
        fetchLeadDetails()
      }
    } catch (err) {
      error('Failed to update status')
    }
  }

  const handleAddNote = async () => {
    if (!note.trim()) return
    
    try {
      const response = await leadService.addNote(id, note)
      if (response.success) {
        setNote('')
        success('Note added successfully')
        fetchLeadDetails()
      }
    } catch (err) {
      error('Failed to add note')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!lead) {
    return null
  }

  const statusOptions = Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label
  }))

  return (
    <div>
      <PageHeader
        title="Lead Details"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Leads', path: '/leads' },
              { label: lead.name }
            ]}
          />
        }
        action={
          <Button variant="ghost" onClick={() => navigate('/leads')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Leads
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Lead Information">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Full Name</label>
                <p className="mt-1 text-secondary-900 dark:text-white font-medium">{lead.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-gray-400 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <p className="mt-1 text-secondary-900 dark:text-white font-medium">{lead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-gray-400 flex items-center gap-2">
                    <Phone size={16} /> Phone
                  </label>
                  <p className="mt-1 text-secondary-900 dark:text-white font-medium">{lead.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-700 dark:text-gray-400 flex items-center gap-2">
                  <MessageSquare size={16} /> Message
                </label>
                <p className="mt-1 text-secondary-900 dark:text-white font-medium">{lead.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-gray-400">Source</label>
                  <p className="mt-1 text-secondary-900 dark:text-white font-medium">{lead.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-gray-400 flex items-center gap-2">
                    <Calendar size={16} /> Created At
                  </label>
                  <p className="mt-1 text-secondary-900 dark:text-white font-medium">{formatDateTime(lead.createdAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Activity Timeline">
            <div className="space-y-4">
              {lead.timeline && lead.timeline.length > 0 ? (
                lead.timeline.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b border-secondary-200 dark:border-gray-700 last:border-0">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
                    <div className="flex-1">
                      <p className="text-sm text-secondary-900 dark:text-white">
                        {activity.event_type === 'status_change' 
                          ? `Status changed from ${activity.event_data?.old_status} to ${activity.event_data?.new_status}`
                          : activity.event_data?.note || activity.event_data?.message || 'Activity recorded'
                        }
                      </p>
                      <p className="text-xs text-secondary-600 dark:text-gray-400 mt-1">
                        {activity.creator?.name || 'System'} • {formatDateTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary-600 dark:text-gray-400 text-center py-4">No activity yet</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Status">
            <Select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={statusOptions}
            />
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${LEAD_STATUS_CONFIG[lead.status].color}`}>
                {LEAD_STATUS_CONFIG[lead.status].label}
              </span>
            </div>
          </Card>

          <Card title="Add Note">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this lead..."
              rows={4}
            />
            <Button onClick={handleAddNote} className="w-full mt-4">
              Add Note
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
