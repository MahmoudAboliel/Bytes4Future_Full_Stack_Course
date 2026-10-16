import { Outlet } from "react-router"
import MainHeader from "./MainHeader"

const MainLayout = () => {
  return (
    <main className="dark:bg-slate-900/97 w-full overflow-hidden min-h-screen">
        <MainHeader />
        <div className="container p-4 mx-auto">
            <Outlet />
        </div>
    </main>
  )
}

export default MainLayout