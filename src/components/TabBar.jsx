import React from 'react'

export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 bg-cinema-surface border border-cinema-border rounded-xl p-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === tab.value
              ? 'bg-cinema-gold text-cinema-bg shadow-md'
              : 'text-cinema-subtext hover:text-cinema-text hover:bg-cinema-border/50'
          }`}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
