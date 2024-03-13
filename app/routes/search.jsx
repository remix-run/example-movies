import { useFetcher, useLocation } from '@remix-run/react'
import localforage from 'localforage'
import { useEffect, useRef, useState } from 'react'
import { MovieLink } from '../movie-link'

// Query the database on the server before the data is replicated to indexeddb
export async function loader({ request, context: { cloudflare: { env } } }) {
  let q = new URL(request.url).searchParams.get('q')
  if (!q) return []

  q = `"${q.replace(/"/g, '""')}"`

  let query = await env.DB.prepare(
    `SELECT id, title, extract FROM movies WHERE id IN (
      SELECT rowid FROM fts_movies WHERE fts_movies MATCH ?1 
    )
    LIMIT 20`,
  )
    .bind(q)
    .all()

  return query.results
}

// Cache the data in indexeddb for future searches
export async function clientLoader({ serverLoader, request }) {
  // before data is stored in indexeddb, it hits the server to search
  if (!memory) {
    replicateMovies()
    return serverLoader()
  }

  // after it searches it searches the data locally
  let q = new URL(request.url).searchParams.get('q')
  if (!q) return []

  let matches = []
  for (let movie of memory) {
    if (
      movie.title.toLowerCase().includes(q) ||
      movie.extract.toLowerCase().includes(q)
    ) {
      matches.push(movie)
    }
    if (matches.length >= 20) break
  }
  return matches
}

let memory
let replicateMovies = async () => {
  replicateMovies = () => {}
  let cached = await localforage.getItem('all-movies')
  if (cached) {
    memory = cached
    return
  }

  let response = await fetch('/all-movies.json')
  let movies = await response.json()
  localforage.setItem('all-movies', movies)
  memory = movies
}

// This is NOT an example of a production ready component, there's just enough
// to simulate a search modal but it is not accessible enough, it's recommended
// you use a modal from a library like React Aria, etc.
export function Search() {
  let [show, setShow] = useState(false)
  let ref = useRef()

  let location = useLocation()
  let search = useFetcher()

  useEffect(() => {
    if (show) {
      ref.current.select()
    }
  }, [show])

  useEffect(() => {
    setShow(false)
  }, [location])

  // bind command + k
  useEffect(() => {
    let listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setShow(true)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <>
      <button
        onClick={() => {
          setShow(true)
        }}
      >
        Search
      </button>
      <div
        onClick={() => {
          setShow(false)
        }}
        hidden={!show}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vw',
          margin: 'auto',
          background: 'hsla(0, 100%, 100%, 0.9)',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'white',
            width: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            margin: '20px auto',
            border: 'solid 1px #ccc',
            borderRadius: 10,
            boxShadow: '0 0 10px #ccc',
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setShow(false)
            }
          }}
        >
          <search.Form method="get" action="/search">
            <input
              ref={ref}
              placeholder="search"
              type="search"
              name="q"
              onKeyDown={(event) => {
                if (
                  event.key === 'Escape' &&
                  event.currentTarget.value === ''
                ) {
                  setShow(false)
                } else {
                  event.stopPropagation()
                }
              }}
              onChange={(event) => {
                search.submit(event.currentTarget.form)
              }}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                fontSize: '1.5em',
                position: 'sticky',
                top: 0,
                border: 'none',
                borderBottom: 'solid 1px #ccc',
                outline: 'none',
              }}
            />
            <ul style={{ padding: '0 20px', minHeight: '1rem' }}>
              {search.data &&
                search.data.map((movie, index) => (
                  <li key={index}>
                    <div>
                      <h3 style={{ marginBottom: 0 }}>
                        <MovieLink movie={movie} />
                      </h3>
                      <p style={{ marginTop: 0 }}>
                        {movie.extract.slice(0, 200)}...
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </search.Form>
        </div>
      </div>
    </>
  )
}
