import {
  Area,
  AreaChart,
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

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function AppointmentInsights({ data, loading }) {
  if (loading) {
    return (
      <Card size="sm" title="Appointments Overview" className="h-full">
        <div className="h-56 flex items-center justify-center text-sm text-slate-500">Loading appointments…</div>
      </Card>
    )
  }

  const summary = data?.summary || {}
  const byStatus = (data?.by_status || []).filter((d) => d.value > 0)
  const trend = data?.trend || []
  const byService = data?.by_service || []

  return (
    <Card size="sm" title="Appointments Overview" className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        <div className="rounded-md bg-slate-50 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-700 px-2 py-1.5">
          <div className="text-[10px] text-slate-500 uppercase">Today</div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">{summary.today || 0}</div>
        </div>
        <div className="rounded-md bg-amber-50/80 border border-amber-100 px-2 py-1.5">
          <div className="text-[10px] text-amber-700/80 uppercase">Pending</div>
          <div className="text-base font-semibold text-amber-800">{summary.pending || 0}</div>
        </div>
        <div className="rounded-md bg-sky-50/80 border border-sky-100 px-2 py-1.5">
          <div className="text-[10px] text-sky-700/80 uppercase">Next 7 days</div>
          <div className="text-base font-semibold text-sky-800">{summary.upcoming_7 || 0}</div>
        </div>
        <div className="rounded-md bg-emerald-50/80 border border-emerald-100 px-2 py-1.5">
          <div className="text-[10px] text-emerald-700/80 uppercase">Confirmed</div>
          <div className="text-base font-semibold text-emerald-800">{summary.confirmed || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[11px] font-medium text-slate-600 mb-1.5">Status mix</p>
          <div className="h-[180px]">
            {byStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No appointments yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderLabel}
                  >
                    {byStatus.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
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

        <div>
          <p className="text-[11px] font-medium text-slate-600 mb-1.5">Bookings — last 14 days</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="apptArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} minTickGap={20} />
                <YAxis allowDecimals={false} width={28} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="total" name="Bookings" stroke="#0284c7" fill="url(#apptArea)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-medium text-slate-600 mb-1.5">Top services by bookings</p>
        <div className="h-[180px]">
          {byService.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No service bookings yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byService} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v?.length > 16 ? `${v.slice(0, 16)}…` : v)}
                />
                <Tooltip />
                <Bar dataKey="count" name="Bookings" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  )
}
