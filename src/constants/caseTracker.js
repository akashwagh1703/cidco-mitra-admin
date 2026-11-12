export const CASE_STATUSES = [
  'In-Process at CIDCO',
  'Completed',
  'Reject',
  'Reject (Conveyance Not Done)',
]

export const CASE_STATUS_COLORS = {
  'In-Process at CIDCO': 'bg-amber-100 text-amber-900',
  Completed: 'bg-emerald-100 text-emerald-900',
  Reject: 'bg-rose-100 text-rose-900',
  'Reject (Conveyance Not Done)': 'bg-rose-100 text-rose-900',
}

export const CIDCO_NODES = [
  'Airoli',
  'Belapur',
  'CIDCO Bhavan',
  'Ghansoli',
  'Kalamboli',
  'Kamothe',
  'Kharghar',
  'Nerul',
  'Ulwe',
  'Vashi',
]

export const SERVICE_TYPES = [
  'Purchase/Sale Transfer',
  'Heirship Transfer',
  'Gift Deed',
  'Gift Deed (Brother)',
  'Gift Deed (Mother)',
  'Name Change',
  'Property Tax name change',
  'NOC',
  'Mortgage',
  'Release Deed',
  'Revalidation',
  'Lease Agreement Register',
  'Home Loan DSA',
  'Sale Purchase Multiple Transfer',
]

export const LEAD_SOURCES = [
  'Advocate Case',
  'Whatsapp Ads',
  'GMB Ads',
  'Social Media',
  'Leaflet Distribution',
  'Bank Reference',
  'Own Ref',
  'D Sir Reference',
  'Swapnil Akdmal Sir Ref',
  'Mahesh from Bank',
  'Admin',
  'Website',
]

export const TRACKER_COLUMNS = [
  { key: 'sr', label: 'Sr No', width: 56, readOnly: true, sticky: true },
  { key: 'date_opened', label: 'Date Opened', width: 120, type: 'date' },
  { key: 'month', label: 'Month', width: 70, readOnly: true },
  { key: 'name', label: 'Customer Name', width: 160, type: 'text', sticky: true },
  { key: 'phone', label: 'Contact No', width: 120, type: 'tel' },
  { key: 'client_location', label: 'Client Location', width: 120, type: 'text' },
  { key: 'cidco_node', label: 'CIDCO Node', width: 120, type: 'select', options: CIDCO_NODES },
  { key: 'ado_name', label: 'ADO Name', width: 150, type: 'select', options: [] },
  { key: 'ado_contact', label: 'ADO Contact', width: 120, type: 'tel' },
  { key: 'cfc_file_no', label: 'CFC/File No', width: 120, type: 'text' },
  { key: 'service_type', label: 'Service Type', width: 170, type: 'select', options: SERVICE_TYPES },
  { key: 'source', label: 'Lead Source', width: 140, type: 'select', options: LEAD_SOURCES },
  { key: 'case_status', label: 'Current Status', width: 160, type: 'select', options: CASE_STATUSES },
  { key: 'gross_fee', label: 'Gross Fee (A)', width: 110, type: 'number' },
  { key: 'paper_office_exp', label: 'Paper/Office Exp (B)', width: 130, type: 'number' },
  { key: 'cidco_fees', label: 'CIDCO Fees (C)', width: 120, type: 'number' },
  { key: 'total_exp', label: 'Total Exp (B+C)', width: 120, readOnly: true },
  { key: 'net_profit', label: 'Net Profit', width: 110, readOnly: true },
  { key: 'margin_percent', label: 'Margin %', width: 90, readOnly: true },
  { key: 'days_open', label: 'Days Open', width: 90, readOnly: true },
  { key: 'next_action_date', label: 'Next Action Date', width: 130, type: 'date' },
  { key: 'next_action_item', label: 'Next Action Item', width: 180, type: 'text' },
]
