const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout