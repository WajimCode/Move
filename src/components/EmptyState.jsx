import React from 'react'

export default function EmptyState({ icon = '🎬', title = 'Nothing here', message = '', action = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
      <span className="text-6xl">{icon}</span>
      <h3 className="font-display text-3xl tracking-widest text-cinema-text">{title}</h3>
      {message && <p className="text-cinema-muted text-center max-w-md leading-relaxed">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
