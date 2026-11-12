import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-secondary-200 dark:border-gray-700 bg-secondary-50 dark:bg-gray-800">
      <div className="text-xs sm:text-sm text-secondary-600 dark:text-gray-400 font-medium text-center sm:text-left">
        Showing <span className="text-secondary-900 dark:text-white">{startItem}</span> to <span className="text-secondary-900 dark:text-white">{endItem}</span> of <span className="text-secondary-900 dark:text-white">{totalItems}</span>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-secondary-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-secondary-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} className="text-secondary-600 dark:text-gray-300" />
        </button>
        
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${page === currentPage
                    ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-700 border border-secondary-300 dark:border-gray-600 hover:bg-secondary-50 dark:hover:bg-gray-600 text-secondary-700 dark:text-gray-300'
                  }
                `}
              >
                {page}
              </button>
            )
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return <span key={page} className="px-2 dark:text-gray-400">...</span>
          }
          return null
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-secondary-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-secondary-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} className="text-secondary-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
