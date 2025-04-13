/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// usage
// curl -X GET 'https://fetcher.drahoslav.workers.dev/?url=https://facebook.com/events/123456789

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

      const newRequest = new Request(remote, request)
      // pretend to be browser
      newRequest.headers.delete('Origin')
      newRequest.headers.set('sec-fetch-dest', 'document')
      newRequest.headers.set('sec-fetch-mode', 'navigate')
      newRequest.headers.set('sec-fetch-site', 'same-origin')
      newRequest.headers.set('sec-fetch-user', '?1')

      // Fetch the actuall resource
      const originalResponse = await fetch(newRequest, {
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
