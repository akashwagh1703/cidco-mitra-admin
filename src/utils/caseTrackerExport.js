import { TRACKER_COLUMNS } from '../constants/caseTracker'

const toDisplayDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`
}

const cellValue = (row, key, sr) => {
  if (key === 'sr') return sr
  if (key === 'date_opened' || key === 'next_action_date') return toDisplayDate(row[key])
  if (key === 'margin_percent') {
    return row.margin_percent === null || row.margin_percent === undefined || row.margin_percent === ''
      ? ''
      : `${row.margin_percent}%`
  }
  if (['gross_fee', 'paper_office_exp', 'cidco_fees', 'total_exp', 'net_profit', 'days_open'].includes(key)) {
    return row[key] === null || row[key] === undefined ? '' : Number(row[key])
  }
  return row[key] ?? ''
}

const isNumericCol = (key) =>
  ['sr', 'gross_fee', 'paper_office_exp', 'cidco_fees', 'total_exp', 'net_profit', 'days_open'].includes(key)

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Export Master Case Tracker as colored Excel-compatible .xls
 * (same blue header / alignment style as the on-screen grid)
 */
export const exportCaseTrackerExcel = (rows, filename = 'master-case-tracker') => {
  const headerCells = TRACKER_COLUMNS.map((col) => {
    const width = Math.max(8, Math.round(col.width / 8))
    return `<th style="
      background:#1F4E79;
      color:#FFFFFF;
      font-weight:700;
      font-size:11px;
      font-family:Calibri, Arial, sans-serif;
      border:1px solid #163B5C;
      padding:6px 8px;
      text-align:center;
      vertical-align:middle;
      white-space:nowrap;
      mso-number-format:'\\@';
    ">${escapeHtml(col.label)}</th>`
  }).join('')

  const bodyRows = rows.map((row, index) => {
    const tds = TRACKER_COLUMNS.map((col) => {
      const raw = cellValue(row, col.key, index + 1)
      const numeric = isNumericCol(col.key)
      const align = numeric ? 'right' : col.key === 'case_status' || col.key === 'month' ? 'center' : 'left'
      let bg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
      let color = '#0F172A'

      if (col.key === 'case_status') {
        if (raw === 'Completed') { bg = '#D1FAE5'; color = '#065F46' }
        else if (String(raw).startsWith('Reject')) { bg = '#FFE4E6'; color = '#9F1239' }
        else if (raw === 'In-Process at CIDCO') { bg = '#FEF3C7'; color = '#92400E' }
      }
      if (col.key === 'net_profit' && raw !== '') {
        color = Number(raw) >= 0 ? '#047857' : '#BE123C'
      }

      const display = raw === null || raw === undefined ? '' : escapeHtml(raw)
      const numberFormat = numeric && col.key !== 'sr' && col.key !== 'days_open'
        ? `mso-number-format:'#,##0.00';`
        : numeric
          ? `mso-number-format:'0';`
          : `mso-number-format:'\\@';`

      return `<td style="
        background:${bg};
        color:${color};
        font-size:11px;
        font-family:Calibri, Arial, sans-serif;
        border:1px solid #CBD5E1;
        padding:5px 8px;
        text-align:${align};
        vertical-align:middle;
        white-space:nowrap;
        ${numberFormat}
      ">${display}</td>`
    }).join('')

    return `<tr>${tds}</tr>`
  }).join('')

  const colGroup = TRACKER_COLUMNS.map((col) => {
    const width = Math.max(50, col.width)
    return `<col style="width:${width}px;" />`
  }).join('')

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Master Case Tracker</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table { border-collapse: collapse; }
  </style>
</head>
<body>
  <table border="1" cellspacing="0" cellpadding="0">
    <colgroup>${colGroup}</colgroup>
    <thead>
      <tr>${headerCells}</tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>
</body>
</html>`

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `${filename}_${stamp}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
