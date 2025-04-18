export const safeUrl = (url: string) =>
  `https://fetcher.drahoslav.workers.dev/?url=${encodeURIComponent(url)}`

const safeFetch = async (url: string) => {
  return await fetch(safeUrl(url))
}

export default safeFetch
