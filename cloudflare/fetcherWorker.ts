/**
 * Fetcher Worker — CORS-friendly proxy for fetching third-party pages.
 *
 * - Sends browser-like headers to receive full HTML from sites like Facebook
 * - Handles redirects manually and rewrites them back through this worker
 * - Removes potentially preloading "Link" headers from responses
 * - Adds "Access-Control-Allow-Origin: *" so clients can read the response
 *
 * Dev:    npm run dev    → http://localhost:8787/
 * Deploy: npm run deploy
 *
 * Example:
 *   curl -G 'https://fetcher.drahoslav.workers.dev' \
 *     --data-urlencode "url=https://facebook.com/events/123456789"
 *
 * Docs: https://developers.cloudflare.com/workers/
 */

// Custom headers needed to force facebook to send the expected content
const REQ_HEADERS = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-GB,en;q=0.9',
  'Cache-Control': 'max-age=0',
  Drp: '1',
  Priority: 'u=0,i',
  'Upgrade-Insecure-Requests': '1',
  TE: 'Trailers',
  Connection: 'keep-alive',
  Pragma: 'no-cache',
  'sec-ch-prefers-color-scheme': 'dark',
  'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'sec-ch-ua-full-version-list':
    '"Google Chrome";v="135.0.7049.85", "Not-A.Brand";v="8.0.0.0", "Chromium";v="135.0.7049.85"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-model': '""',
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua-platform-version': '"19.0.0"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'Viewport-Width': '1920',
}

export default {
  async fetch(request, env, ctx) {
    // handle preflight
    if (request.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      })
    }

    try {
      const url = new URL(request.url)
      const remote = url.searchParams.get('url')

      if (!remote) {
        return new Response('Missing "url" parameter', { status: 400 })
      }

      // Fetch the actuall resource
      const originalResponse = await fetch(remote, {
        headers: REQ_HEADERS, // pretend to be browser
        redirect: 'manual', // do not follow possible redirects automatically
      })

      // Handle redirects manually
      if (originalResponse.status >= 300 && originalResponse.status < 400) {
        const location = originalResponse.headers.get('Location')
        if (location) {
          // Construct a new URL for the redirect
          const redirectUrl = new URL(location, remote).toString()

          // Create a response with the redirect location, but add CORS headers
          const redirectResponse = new Response(null, {
            status: originalResponse.status,
            statusText: originalResponse.statusText,
            headers: {
              Location: `${url.origin}${url.pathname}?url=${encodeURIComponent(redirectUrl)}`,
              'Access-Control-Allow-Origin': '*',
            },
          })

          return redirectResponse
        }
      }

      // Get the original response body as a readable stream
      const originalBody = originalResponse.body

      // Create a new response with the original body stream
      const newHeaders = new Headers(originalResponse.headers)
      // Remove the Link header to prevent fetching aditional resources by browser
      newHeaders.delete('Link')
      // Allow all origins to access the resource
      newHeaders.set('Access-Control-Allow-Origin', '*')

      return new Response(originalBody, {
        status: originalResponse.status,
        statusText: originalResponse.statusText,
        headers: newHeaders,
      })
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 })
    }
  },
}
