import { defer, Await, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { MovieLink } from '../movie-link'

export async function loader({ context: { env } }) {
  // use defer to unblock this DB query from the first byte
  // - speeds up TTFB
  // - speeds up FCP, LCP too because the browser can start downloading the
  //   assets in parallel with the server side DB query
  return defer({
    query: env.DB.prepare(
      `SELECT * FROM movies WHERE thumbnail != '' ORDER BY RANDOM() LIMIT 12`,
    ).all(),
  })
}

// keep the home page data in memory so back clicks are instant and the data
// doesn't change
let cache
export async function clientLoader({ serverLoader }) {
  if (cache) return { query: cache }

  let loaderData = await serverLoader()
  let query = await loaderData.query
  cache = query
  return { query }
}

// So that the client loader is called on initial load
clientLoader.hydrate = true

export default function Home() {
  let { query } = useLoaderData()

  return (
    <>
      <title>Data Loading in Remix</title>
      <p>
        Use Command + K to search. Here are a few random movies from the
        database
      </p>
      <Suspense fallback={<Loading />}>
        <Await resolve={query}>
          {(query) => (
            <ul>
              {query.results.map((movie) => (
                <li key={movie.id}>
                  <MovieLink movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </>
  )
}

function Loading() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <RandomLengthDashes /> <RandomLengthDashes /> <RandomLengthDashes />
        </li>
      ))}
    </ul>
  )
}

function RandomLengthDashes() {
  return <span>{'-'.repeat(Math.floor(Math.random() * 20))}</span>
}
