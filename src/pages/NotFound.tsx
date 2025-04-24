import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center font-libre-franklin">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-opacity-90 transition-opacity"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
