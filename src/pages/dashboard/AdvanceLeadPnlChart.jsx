import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../components/ui/Card'
import { dashboardService } from '../../services/dashboardService'

const PERIODS = [
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload || {}
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-900 mb-1.5">{label}</p>
      <div className="space-y-1 text-slate-600">
        <p>Cases: <strong className="text-slate-900">{row.cases || 0}</strong></p>
        <p>Gross Fee: <strong className="text-sky-700">{inr(row.gross_fee)}</strong></p>
        <p>Total Exp: <strong className="text-amber-700">{inr(row.total_exp)}</strong></p>
        <p>
          Net P&amp;L:{' '}
          <strong className={Number(row.net_profit) >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
            {inr(row.net_profit)}
          </strong>
        </p>
      </div>
    </div>
  )
}

export default function AdvanceLeadPnlChart() {
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const response = await dashboardService.getAdvanceLeadPnl(period)
        if (!cancelled && response?.success) {
          setData(response.data)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [period])

  const series = useMemo(() => data?.series || [], [data])
  const summary = data?.summary || { cases: 0, gross_fee: 0, total_exp: 0, net_profit: 0 }
  const netPositive = Number(summary.net_profit) >= 0

  return (
    <Card
      size="sm"
      title="Advance Lead — Profit & Loss"
      action={
        <div className="flex items-center gap-0.5 rounded-md bg-slate-100 dark:bg-gray-700 p-0.5">
          {PERIODS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`px-2 sm:px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                period === item.value
                  ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <div className="rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/40 px-2.5 py-1.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Cases</div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">{summary.cases}</div>
        </div>
        <div className="rounded-md border border-sky-100 dark:border-sky-900/40 bg-sky-50/70 dark:bg-sky-950/20 px-2.5 py-1.5">
          <div className="text-[10px] uppercase tracking-wide text-sky-700/80">Gross Fee</div>
          <div className="text-base font-semibold text-sky-800 dark:text-sky-300 truncate">{inr(summary.gross_fee)}</div>
        </div>
        <div className="rounded-md border border-amber-100 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 px-2.5 py-1.5">
          <div className="text-[10px] uppercase tracking-wide text-amber-700/80">Total Exp</div>
          <div className="text-base font-semibold text-amber-800 dark:text-amber-300 truncate">{inr(summary.total_exp)}</div>
        </div>
        <div className={`rounded-md border px-2.5 py-1.5 ${
          netPositive
            ? 'border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20'
            : 'border-rose-100 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20'
        }`}>
          <div className={`text-[10px] uppercase tracking-wide ${netPositive ? 'text-emerald-700/80' : 'text-rose-700/80'}`}>
            Net P&amp;L
          </div>
          <div className={`text-base font-semibold truncate ${netPositive ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
            {inr(summary.net_profit)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-slate-500">
          Loading P&amp;L chart...
        </div>
      ) : series.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-slate-500">
          No Advance Lead data for this period.
        </div>
      ) : (
        <div className="w-full h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grossBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0.75} />
                </linearGradient>
                <linearGradient id="expBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0.75} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={period === 'day' ? 28 : 12}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={56}
                tickFormatter={(v) => {
                  if (Math.abs(v) >= 100000) return `${(v / 100000).toFixed(1)}L`
                  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`
                  return String(v)
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
              />
              <Bar
                dataKey="gross_fee"
                name="Gross Fee"
                fill="url(#grossBar)"
                radius={[4, 4, 0, 0]}
                maxBarSize={period === 'year' ? 48 : 28}
              />
              <Bar
                dataKey="total_exp"
                name="Total Exp"
                fill="url(#expBar)"
                radius={[4, 4, 0, 0]}
                maxBarSize={period === 'year' ? 48 : 28}
              />
              <Line
                type="monotone"
                dataKey="net_profit"
                name="Net P&L"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#059669', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-2 text-[10px] text-slate-500">
        Date opened · bars = Gross vs Exp · line = Net P&amp;L
      </p>
    </Card>
  )
}
