import { useState, useEffect, useCallback } from 'react'
import { FileText, CheckCircle, Clock, CalendarDays, AlertTriangle } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import Spinner from '../../components/common/Spinner'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import AdvanceLeadPnlChart from './AdvanceLeadPnlChart'
import AppointmentInsights from './AppointmentInsights'
import AdvanceLeadInsights from './AdvanceLeadInsights'
import { dashboardService } from '../../services/dashboardService'
import { leadService } from '../../services/leadService'
import { formatDateTime } from '../../utils/formatters'

const statusColors = {
  new: '#3b82f6',
  contacted: '#eab308',
  follow_up: '#a855f7',
  converted: '#22c55e',
  not_interested: '#64748b',
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [insights, setInsights] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const [dashData, leadsData] = await Promise.all([
        dashboardService.getDashboardData(),
        leadService.getLeads({ page: 1, per_page: 5 }),
      ])

      if (dashData?.success) setDashboardData(dashData.data)
      if (leadsData?.success) setRecentLeads(leadsData.data.data || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setFetchError('Failed to load dashboard data. Please try again.')
      setDashboardData(null)
      setRecentLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true)
    try {
      const response = await dashboardService.getInsights()
      if (response?.success) setInsights(response.data)
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setInsightsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
    fetchInsights()
  }, [fetchDashboardData, fetchInsights])

  const handleRetry = () => {
    fetchDashboardData()
    fetchInsights()
  }

  if (loading) {
    return <Spinner className="h-10 w-10" label="Loading dashboard" />
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">{fetchError}</p>
        <Button onClick={handleRetry}>Retry</Button>
      </div>
    )
  }

  const statusData = Object.entries(dashboardData?.leads_by_status || {}).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
    color: statusColors[key] || '#64748b',
  }))

  const totalLeads = dashboardData?.total_leads || 0
  const todayLeads = dashboardData?.today_leads || 0
  const appt = dashboardData?.appointments || {}
  const adv = dashboardData?.advance_leads || {}

  const kpis = [
    { title: "Today's Appointments", value: appt.today || 0, icon: CalendarDays, color: 'primary' },
    { title: 'Pending Appointments', value: appt.pending || 0, icon: Clock, color: 'warning' },
    { title: 'Upcoming Appointments', value: appt.upcoming || 0, icon: CalendarDays, color: 'primary' },
    { title: 'Actions Due (Cases)', value: adv.actions_due || 0, icon: AlertTriangle, color: 'danger' },
    { title: 'Cases In Process', value: adv.in_process || 0, icon: FileText, color: 'warning' },
    { title: 'Total Leads', value: totalLeads, icon: FileText, color: 'primary' },
    { title: "Today's Leads", value: todayLeads, icon: Clock, color: 'success' },
    { title: 'Converted', value: dashboardData?.leads_by_status?.converted || 0, icon: CheckCircle, color: 'success' },
  ]

  return (
    <div className="space-y-4 max-w-full">
      {/* 1. Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>

      {/* 1. Compact KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-2.5">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.title}
            size="sm"
            title={kpi.title}
            value={String(kpi.value)}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* 2. Advance Lead P&L */}
      <AdvanceLeadPnlChart />

      {/* 3. Appointment + Advance Lead ops */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AppointmentInsights data={insights?.appointments} loading={insightsLoading} />
        <AdvanceLeadInsights data={insights?.advance_leads} loading={insightsLoading} />
      </div>

      {/* 4. Lead status + recent */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card size="sm" title="Website Lead Status">
          <div className="h-[240px]">
            {statusData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-secondary-400 dark:text-secondary-500">No lead data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card size="sm" title="Recent Leads">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700 text-left text-[11px] uppercase tracking-wide text-secondary-500 dark:text-secondary-400">
                  <th className="px-2 py-2 font-medium">Name</th>
                  <th className="px-2 py-2 font-medium">Email</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-2 py-8 text-center text-xs text-secondary-400 dark:text-secondary-500">No recent leads</td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                      <td className="px-2 py-2 font-medium text-secondary-900 dark:text-white whitespace-nowrap">{lead.name}</td>
                      <td className="px-2 py-2 text-secondary-600 dark:text-secondary-300 max-w-[160px] truncate">{lead.email}</td>
                      <td className="px-2 py-2">
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200 capitalize">
                          {String(lead.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-xs text-secondary-500 dark:text-secondary-400 whitespace-nowrap">{formatDateTime(lead.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
