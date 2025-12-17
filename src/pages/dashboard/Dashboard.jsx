import { useState, useEffect } from 'react'
import { FileText, Users, CheckCircle, Clock } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/common/PageHeader'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardService } from '../../services/dashboardService'
import { leadService } from '../../services/leadService'

const statusColors = {
  new: '#3b82f6',
  contacted: '#eab308',
  follow_up: '#a855f7',
  converted: '#22c55e',
  not_interested: '#64748b'
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [dashData, leadsData] = await Promise.all([
        dashboardService.getDashboardData(),
        leadService.getLeads({ page: 1, per_page: 5 })
      ])

      if (dashData?.success) {
        setDashboardData(dashData.data)
      }

      if (leadsData?.success) {
        setRecentLeads(leadsData.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const leadTrendData = dashboardData?.leads_last_7_days?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leads: item.count
  })) || []

  const statusData = Object.entries(dashboardData?.leads_by_status || {}).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value,
    color: statusColors[key] || '#64748b'
  }))

  const totalLeads = dashboardData?.total_leads || 0
  const todayLeads = dashboardData?.today_leads || 0
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your admin panel"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Leads"
          value={totalLeads.toString()}
          icon={FileText}
          color="primary"
        />
        <StatCard
          title="Today's Leads"
          value={todayLeads.toString()}
          icon={Clock}
          color="success"
        />
        <StatCard
          title="Converted"
          value={(dashboardData?.leads_by_status?.converted || 0).toString()}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="New Leads"
          value={(dashboardData?.leads_by_status?.new || 0).toString()}
          icon={FileText}
          color="warning"
        />
      </div>

      <div className="mb-6">
        <Card title="Lead Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Leads">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-gray-800 border-b border-secondary-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-gray-300 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-secondary-200 dark:divide-gray-700">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-secondary-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900 dark:text-white">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600 dark:text-gray-300">{lead.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${lead.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                      ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                      ${lead.status === 'Follow-up' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                      ${lead.status === 'Converted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    `}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600 dark:text-gray-300">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
