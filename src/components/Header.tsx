import { useState, useEffect, useRef } from 'react'

const Header = () => {
  const [rest, setRest] = useState<string>('erator ')
  const [letters, setLetters] = useState<string[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timeout: ReturnType<typeof setTimeout> | null = null
    const t = rest.split('')
    timeoutRef.current = setTimeout(
      () => {
        if (t.length > 0) {
          const letter = t.shift() ?? ''
          setLetters([...letters, letter])
          setRest(t.join(''))
        } else {
          clearTimeout(timeoutRef.current ?? undefined)
        }
      },
      letters.length === 0 ? 500 : 250
    )
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [letters, rest])

  return (
    <h1 className="bg-zinc-900 text-2xl text-white mb-6 font-bold font-libre-franklin rounded-md p-1 px-3">
      <a href="/">
        <span className="text-white underline">AV Gen</span>
        {letters.map((letter, index, { length }) => (
          <span
            key={index}
            className={`${index !== length - 1 ? 'text-brand-red decoration-brand-red' : 'text-zinc-900 decoration-zinc-9text-zinc-900'} underline  transition-colors duration-1000 ease-in-out`}
          >
            {letter}
          </span>
        ))}
        <span className="text-zinc-900 decoration-black underline">{rest}</span>
      </a>
    </h1>
  )
}

export default Header
