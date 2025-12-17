import { useState } from 'react'

export default function Tabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div>
      <div className="border-b border-secondary-200">
        <nav className="flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === index
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}
