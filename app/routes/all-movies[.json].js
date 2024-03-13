import { json } from '@remix-run/react'

export async function loader({ context: { cloudflare: { env } } }) {
  let query = await env.DB.prepare(
    `SELECT id, title, extract, thumbnail FROM movies`,
  ).all()

  return json(query.results.reverse(), {
    headers: {
      'Cache-Control': `public, max-age=${60 * 60 * 24}`,
    },
  })
}
