import { useLoaderData } from '@remix-run/react'
import localforage from 'localforage'

// Initial SSR and first visits will get fresh data from the DB on the server
export async function loader({ params, context: { env } }) {
  let result = await env.DB.prepare('SELECT * FROM movies WHERE id = ?1')
    .bind(params.id)
    .first()
  return { movie: result }
}

// Cache movies individually in session storage in the browser for super fast
// back/forward/revisits during the session, but will fetch fresh data
// from the server if the user closes the tab and comes back later
export async function clientLoader({ serverLoader, params }) {
  let cacheKey = `movie-${params.id}`
  let cache = sessionStorage.getItem(cacheKey)
  if (cache) return { movie: JSON.parse(cache) }

  let { movie } = await serverLoader()
  sessionStorage.setItem(cacheKey, JSON.stringify(movie))
  return { movie }
}

export default function Movie() {
  let { movie } = useLoaderData()
  return (
    <>
      <title>{movie.title}</title>
      <meta name="description" content={movie.extract} />

      <div style={{ display: 'flex' }}>
        <div
          style={{
            background: '#eee',
            marginRight: 20,
            width: 27 * 10,
            height: 40 * 10,
          }}
        >
          <img
            key={movie.id}
            src={movie.thumbnail || X}
            alt="movie poster"
            style={{
              objectFit: movie.thumbnail ? 'cover' : 'fill',
              transition: 'opacity 300ms ease-in-out',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginTop: 0 }}>
            {movie.title} ({movie.year})
          </h1>
          <p>{movie.extract}</p>
        </div>
      </div>
    </>
  )
}

const X =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAACy0lEQVR4nO3Z2XbjIBAE0Bp9OZ8+Dz2e40QCNdAb0PWSE8sWXTexreVPAVAKMoxcKCWxWCnloh/p9ZJSPlhIr2Y+ONf9ocyPfLFctQ0Z4DfI1d58dG4UN6ynJ52YJ4QnrMpTD0qlfgWr/oL9Uy9ex2q+bNs0Kzex3l68W97KvmExdrFJGDUZWLwdrR1eQR4We3dLhl2NjdWz05XSU6oHq3PXC6SzTidW/wJx01+kH2tomXAZqjCENbpYlIwOP4o1saRzJsaewJpb2CdzA89hTS9vmulRp7EkhrCIxJASWAjvJTSeEBYCe8kNJoeFkF6iI4liIZiX9DDSWAjjpTCGAhYCeOkMoIMFVy+1pdWw4OSluagmFsy9lJdTxoKhl/5C+lgw8TL5k5hgQbmM1T+vFRbUKhl+LBpiQaGY7ReILRZE65kfmphjQaikx0GcBxamqzqdHjhhYaKw34mUHxaGarueortiobO898UMbyywCbylEAILDIgAUoiChSZHDCkEwkIFJYwUYmHhRhNJCuGw8AUUTAoRsfBhCiaFxOpKPKx8G3KTH/Dc5KEDN3lQyk2e7nCTJ9Lc5CUabvLiHzd5WZmbvGHBTd4K4yZvsnIjXs/WyxBLqZihlxWWaiUrLxMsgzImXvpYZm8T/YWUsYy/sJSX08RyOXTUXFQNy/EkTm1pHSzvywNKAyhguUtRFMaQxgoiRZEeRhQrlBRFdCQ5rIBSFLnBhLDCSlGExpPACi5FkRhyGmsJKcr0qHNYC0lR5gaewFpOijIx9ijWolKU0eGHsJaWogxV6MfaQIrSX6QTaxspSmedHqzNpCg9pdhYW0pR2NV4WBtLUXgFGVjbS1EYNd+wDpGivJVtYh0lRWlWrmMdKEWpF69gHStFqdR/wjpcivKEcMNKqf+5UVztzafnJ8hV25D5ly+W6/5Q5nc+ONf3L5lqSkEpfwElAotXgK0AkQAAAABJRU5ErkJggg=='
