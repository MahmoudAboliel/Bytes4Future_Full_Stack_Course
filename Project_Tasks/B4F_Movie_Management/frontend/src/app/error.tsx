"use client";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: unknown;
  retry: () => void;
}
const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  return <div className="flex flex-col items-center justify-center gap-4 p-4 h-screen">
    <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
    <p className="">{String(error)}</p>
    <Button
      onClick={retry}
      
    >
      Try again
    </Button>
  </div>;
};

export default ErrorPage;
