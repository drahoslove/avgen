export const inLines = (str: string) => {
  return str.split('//').map((line: string) => <div key={line}>{line}</div>)
}
