import { Outlet } from "react-router";
import { useUser } from "../context/UserContext";
import SelectUserCard from "@/components/SelectUserCard";
import Header from "@/components/Header";

const Root = () => {
  const { user } = useUser();

  return (
    <main>
      {!user ? (
        <SelectUserCard />
      ) : (
        <>
          <Header />
          <section className="container mx-auto p-3">
            <Outlet />
          </section>
        </>
      )}
    </main>
  );
};

export default Root;
