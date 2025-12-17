export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  FOLLOW_UP: 'follow_up',
  CONVERTED: 'converted',
  NOT_INTERESTED: 'not_interested'
}

export const LEAD_STATUS_CONFIG = {
  [LEAD_STATUS.NEW]: {
    label: 'New',
    color: 'bg-blue-100 text-blue-800',
    dotColor: 'bg-blue-500'
  },
  [LEAD_STATUS.CONTACTED]: {
    label: 'Contacted',
    color: 'bg-yellow-100 text-yellow-800',
    dotColor: 'bg-yellow-500'
  },
  [LEAD_STATUS.FOLLOW_UP]: {
    label: 'Follow-up',
    color: 'bg-purple-100 text-purple-800',
    dotColor: 'bg-purple-500'
  },
  [LEAD_STATUS.CONVERTED]: {
    label: 'Converted',
    color: 'bg-green-100 text-green-800',
    dotColor: 'bg-green-500'
  },
  [LEAD_STATUS.NOT_INTERESTED]: {
    label: 'Not Interested',
    color: 'bg-gray-100 text-gray-800',
    dotColor: 'bg-gray-500'
  }
}
