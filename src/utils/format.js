export const formatYear = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).getFullYear()
}

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatRating = (rating) => {
  if (!rating) return '—'
  return Number(rating).toFixed(1)
}

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export const formatVoteCount = (count) => {
  if (!count) return '0'
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return count.toString()
}

export const getRatingColor = (rating) => {
  if (rating >= 8) return 'text-green-400'
  if (rating >= 7) return 'text-cinema-gold'
  if (rating >= 6) return 'text-amber-500'
  if (rating >= 5) return 'text-orange-500'
  return 'text-red-500'
}

export const getRatingBg = (rating) => {
  if (rating >= 8) return 'bg-green-400/10 text-green-400'
  if (rating >= 7) return 'bg-cinema-gold/10 text-cinema-gold'
  if (rating >= 6) return 'bg-amber-500/10 text-amber-500'
  if (rating >= 5) return 'bg-orange-500/10 text-orange-500'
  return 'bg-red-500/10 text-red-500'
}

export const highlightText = (text, query) => {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export const STREAMING_SERVICES = [
  { name: 'Netflix', color: '#e50914', icon: '🎬', url: 'https://www.netflix.com/search?q=' },
  { name: 'Prime Video', color: '#00a8e0', icon: '📦', url: 'https://www.amazon.com/s?k=' },
  { name: 'Disney+', color: '#0063e5', icon: '🏰', url: 'https://www.disneyplus.com/search/' },
  { name: 'Apple TV+', color: '#555', icon: '🍎', url: 'https://tv.apple.com/search?term=' },
  { name: 'HBO Max', color: '#5f2d91', icon: '👑', url: 'https://play.max.com/search?q=' },
  { name: 'Hulu', color: '#1ce783', icon: '📺', url: 'https://www.hulu.com/search?q=' },
]
