import { ArrowUpDown, Inbox } from 'lucide-react'

export default function Table({ columns, data, onSort, sortColumn, sortDirection }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <Inbox className="mx-auto text-secondary-400 dark:text-gray-500 mb-3" size={48} />
        <p className="text-secondary-600 dark:text-gray-400 font-medium">No data available</p>
        <p className="text-secondary-500 dark:text-gray-500 text-sm mt-1">There are no records to display</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary-50 dark:bg-gray-800 border-b-2 border-secondary-200 dark:border-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 dark:text-gray-300 uppercase tracking-wider"
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(column.key)}
                    className="flex items-center gap-2 hover:text-secondary-900 dark:hover:text-white transition-colors"
                  >
                    {column.label}
                    <ArrowUpDown size={14} />
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-secondary-100 dark:divide-gray-700">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-secondary-50 dark:hover:bg-gray-700 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-secondary-900 dark:text-white whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
