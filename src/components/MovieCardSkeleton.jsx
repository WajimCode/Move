import React from 'react'

export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-xl skeleton" />
      <div className="mt-2.5 space-y-1.5">
        <div className="h-3.5 skeleton rounded w-4/5" />
        <div className="h-3 skeleton rounded w-1/3" />
      </div>
    </div>
  )
}
