const safeFetch = async (url: string) => {
  return await fetch(`https://fetcher.drahoslav.workers.dev/?url=${encodeURIComponent(url)}`, {
    headers: {
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
    },
  })
}

export default safeFetch
