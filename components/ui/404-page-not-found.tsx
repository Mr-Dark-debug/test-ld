"use client";

import { Button } from "./Button";
import { useRouter } from "next/navigation";

export function NotFoundPage() {
  const router = useRouter();
  
  return (
    <section className="bg-background text-foreground font-sans min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url('https://images.unsplash.com/photo-1578328819059-b70f5a9f9b4c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Look like you're lost
              </h3>
              <p className="mb-6 sm:mb-5">
                The page you are looking for is not available!
              </p>

              <Button
                onClick={() => router.push("/")}
                className="my-5"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageNotFoundDemo() {
  return (
    <div className="w-full">
      <NotFoundPage />
    </div>
  );
}
