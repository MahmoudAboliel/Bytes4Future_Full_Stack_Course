import { RouterProvider } from "react-router"
import { router } from "./lib/constants"

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
