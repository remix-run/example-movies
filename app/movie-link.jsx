import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'

export function MovieLink({ movie }) {
  let [prefetch, setPrefetch] = useState('intent')

  // Don't prefetch cached movies
  useEffect(() => {
    if (sessionStorage.getItem(`movie-${movie.id}`)) {
      setPrefetch('none')
    }
  })

  let prefetchImage = () => {
    if (prefetch === 'none') return
    let img = new Image()
    img.src = movie.thumbnail
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      prefetch={prefetch}
      onMouseEnter={prefetchImage}
      onFocus={prefetchImage}
    >
      {movie.title}
    </Link>
  )
}
