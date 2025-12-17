import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export const exportToExcel = (data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
}

export const exportToCSV = (data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const csv = XLSX.utils.sheet_to_csv(worksheet)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
}
