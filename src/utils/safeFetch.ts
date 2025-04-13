const safeFetch = async (url: string) => {
  return await fetch(`https://fetcher.drahoslav.workers.dev/?url=${encodeURIComponent(url)}`)
}

export default safeFetch
