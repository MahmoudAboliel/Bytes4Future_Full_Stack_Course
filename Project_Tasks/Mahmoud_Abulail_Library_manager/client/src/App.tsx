import { Route, Routes } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import { pages } from "./lib/constances";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          {pages.map(page => (
            <Route index={page.href === "/"} path={page.href} element={<page.element />} />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default App;
