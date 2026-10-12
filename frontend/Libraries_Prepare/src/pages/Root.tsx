import React from "react";
import { Link, Outlet } from "react-router";

const Root = () => {
  return (
    <>
      <div className="bg-black text-white space-x-4 p-2">
        <Link to="/">Home</Link>
        <Link to="/about">about</Link>
        <Link to="/auth/login">login</Link>
        <Link to="/auth/register">register</Link>
      </div>
      <Outlet />
    </>
  );
};

export default Root;
