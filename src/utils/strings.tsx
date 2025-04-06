export const inLines = (str: string) => {
  return str.split(/\/\/|\n/gi).map((line: string, i: number) => <div key={i}>{line}</div>)
}
