import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import { RouterProvider } from 'react-router'
// import { router } from './lib/constants.ts'
// import { UserProvider } from './context/UserContext.tsx'
import DataTable1 from "@/components/DataTable/ExampleApp";
import DataTable2 from "@/lib/DataTable2/example/App";
import { Separator } from './components/ui/separator';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <UserProvider>
      <RouterProvider router={router} />
    </UserProvider> */}
    <DataTable1 />
    <Separator />
    <DataTable2 />
  </StrictMode>,
)
