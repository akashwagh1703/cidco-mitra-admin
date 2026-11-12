import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../components/ui/Card'

const CASE_COLORS = {
  'In-Process at CIDCO': '#f59e0b',
  Completed: '#10b981',
  Reject: '#ef4444',
  'Reject (Conveyance Not Done)': '#f43f5e',
}

export default function AdvanceLeadInsights({ data, loading }) {
  if (loading) {
    return (
      <Card size="sm" title="Advance Lead Operations" className="h-full">
        <div className="h-56 flex items-center justify-center text-sm text-slate-500">Loading advance leads…</div>
      </Card>
    )
  }

  const summary = data?.summary || {}
  const aging = data?.aging || []
  const byStatus = (data?.by_case_status || []).map((item) => ({
    ...item,
    color: CASE_COLORS[item.name] || '#64748b',
  }))
  const byNode = data?.by_node || []
  const openedTrend = data?.opened_trend || []

  return (
    <Card size="sm" title="Advance Lead Operations" className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        <div className="rounded-md bg-slate-50 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-700 px-2 py-1.5">
          <div className="text-[10px] text-slate-500 uppercase">Total cases</div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">{summary.total || 0}</div>
        </div>
        <div className="rounded-md bg-amber-50/80 border border-amber-100 px-2 py-1.5">
          <div className="text-[10px] text-amber-700/80 uppercase">In process</div>
          <div className="text-base font-semibold text-amber-800">{summary.in_process || 0}</div>
        </div>
        <div className="rounded-md bg-rose-50/80 border border-rose-100 px-2 py-1.5">
          <div className="text-[10px] text-rose-700/80 uppercase">Actions due</div>
          <div className="text-base font-semibold text-rose-800">{summary.actions_due || 0}</div>
        </div>
        <div className="rounded-md bg-orange-50/80 border border-orange-100 px-2 py-1.5">
          <div className="text-[10px] text-orange-700/80 uppercase">Aging 60d+</div>
          <div className="text-base font-semibold text-orange-800">{summary.aging_hot || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[11px] font-medium text-slate-600 mb-1.5">Case aging (open cases)</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aging} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} width={28} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" name="Cases" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {aging.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Prioritize red/orange buckets — cases stuck beyond 60–90 days.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-slate-600 mb-1.5">Case status</p>
          <div className="h-[180px]">
            {byStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No case statuses yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={78}
                    innerRadius={42}
                    paddingAngle={2}
                  >
                    {byStatus.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {byStatus.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-medium text-slate-600 mb-1.5">Cases opened — last 14 days</p>
          <div className="h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={openedTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} minTickGap={18} />
                <YAxis allowDecimals={false} width={28} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Opened" fill="#0f766e" radius={[3, 3, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium text-slate-600 mb-1.5">Top CIDCO nodes</p>
          <div className="h-[170px]">
            {byNode.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No node data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byNode} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Cases" fill="#7c3aed" radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Next 7 days actions due: <strong>{summary.actions_upcoming || 0}</strong>
          </p>
        </div>
      </div>
    </Card>
  )
}
