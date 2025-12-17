import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-gray-500" size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
  )
}
