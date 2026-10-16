
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-80px)] text-white">
        <h1 className="text-2xl font-bold">Page Not found</h1>
        <p className="text-muted-foreground">Something went wrong</p>
        <button className="mt-4 cursor-pointer" onClick={() => window.history.back()}>
          Go Back
        </button>
    </div>
  )
}

export default NotFound