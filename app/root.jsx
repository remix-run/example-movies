import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { Search } from './routes/search'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 16,
          letterSpacing: '0.01em',
          fontWeight: 300,
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            width: 800,
            margin: '10px auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1>Movies!</h1>
            <div>
              <a href="https://github.com/remix-run/example-movies">Code</a> •{' '}
              <a href="https://www.youtube.com/playlist?list=PLXoynULbYuEApkwAGZ7U7LmL-BDHloB0l">
                YouTube Videos
              </a>{' '}
              • <a href="https://remix.run/docs/en/main">Remix Docs</a>
            </div>
            <Search />
          </div>
          <Outlet />
          <br style={{ clear: 'both' }} />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
