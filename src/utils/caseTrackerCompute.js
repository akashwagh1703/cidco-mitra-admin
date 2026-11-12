/** Recompute derived Master Case Tracker fields after a local cell edit. */
export function withDerivedCaseFields(row) {
  const gross = Number(row.gross_fee || 0)
  const paper = Number(row.paper_office_exp || 0)
  const cidco = Number(row.cidco_fees || 0)
  const totalExp = Math.round((paper + cidco) * 100) / 100
  const netProfit = Math.round((gross - totalExp) * 100) / 100
  const margin = gross > 0 ? Math.round((netProfit / gross) * 10000) / 100 : null

  let month = row.month ?? null
  let daysOpen = row.days_open ?? null

  if (row.date_opened) {
    const opened = new Date(row.date_opened)
    if (!Number.isNaN(opened.getTime())) {
      month = opened.toLocaleString('en-US', { month: 'short' })
      const status = String(row.case_status || '').trim().toLowerCase()
      if (status === 'completed') {
        daysOpen = null
      } else {
        const today = new Date()
        const start = new Date(opened.getFullYear(), opened.getMonth(), opened.getDate())
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        daysOpen = Math.round((end - start) / 86400000)
      }
    }
  } else {
    month = null
    daysOpen = null
  }

  return {
    ...row,
    month,
    total_exp: totalExp,
    net_profit: netProfit,
    margin_percent: margin,
    days_open: daysOpen,
  }
}

export function applyCaseField(row, field, value) {
  return withDerivedCaseFields({ ...row, [field]: value })
}
