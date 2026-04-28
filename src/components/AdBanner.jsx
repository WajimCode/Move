import React from 'react'

/**
 * Placeholder ad banner – replace inner content with your
 * Google AdSense <ins> tag or any ad network code.
 */
export default function AdBanner({ slot = 'banner', className = '' }) {
  const configs = {
    banner: { label: 'Advertisement', height: 'h-24', width: 'w-full' },
    rectangle: { label: 'Advertisement', height: 'h-64', width: 'w-full max-w-sm' },
    leaderboard: { label: 'Advertisement', height: 'h-24', width: 'w-full max-w-4xl mx-auto' },
  }
  const { label, height, width } = configs[slot] || configs.banner

  return (
    <div className={`${width} ${height} ${className} border border-dashed border-cinema-border/40 rounded-xl flex items-center justify-center bg-cinema-surface/30 relative overflow-hidden`}>
      {/* Replace this div's content with your AdSense code */}
      {/* <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-XXXXX" data-ad-slot="XXXXX" data-ad-format="auto" /> */}
      <div className="text-center">
        <p className="text-xs text-cinema-muted font-mono uppercase tracking-widest">{label}</p>
        <p className="text-xs text-cinema-border mt-1">Ad placeholder – 728×90</p>
      </div>
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px',
        }}
      />
    </div>
  )
}
