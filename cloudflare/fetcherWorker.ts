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
// curl -X GET 'https://fetcher.drahoslav.workers.dev/?url=https://animalrightscalendar.org/events/67c090acb55943f2ac8503ee'

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      const remote = url.searchParams.get('url')

      if (!remote) {
        return new Response('Missing "url" parameter', { status: 400 })
      }

      // Fetch the original response
      const originalResponse = await fetch(remote, request)

      // Get the original response body as a readable stream
      const originalBody = originalResponse.body

      // Create a new response with the original body stream
      const newHeaders = new Headers(originalResponse.headers)
      // Remove the Link header to prevent fetching aditional resources
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
