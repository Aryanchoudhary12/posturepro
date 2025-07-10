"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import home from "@/public/home.png";
import dashboard from "@/public/dashboard.png";
import { useSession, signIn, signOut } from "next-auth/react";
function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between p-3">
      <div className="title h-full ">
        <h1 className="text-2xl font-bold font-mono">
          Posture<span className="text-primary">Pro</span>
        </h1>
      </div>
      <div className="flex justify-center items-center gap-4 pr-4">
        <ul className=" gap-4 flex">
          <li>
            <Link
              href="/"
              className="text-lg font-sans font-medium flex justify-center items-center gap-1"
            >
              <Image
                src={home}
                alt="home"
                height={400}
                width={400}
                className={`h-8 w-8 ${
                  pathname == "/" ? "p-1 bg-secondary-foreground rounded-sm" : "p-1"
                }`}
              ></Image>
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              <Image
                src={dashboard}
                alt="dashboard"
                height={400}
                width={400}
                className={`h-8 w-8 ${
                  pathname == "/dashboard"
                    ? "p-1 bg-secondary-foreground rounded-sm"
                    : "p-1"
                }`}
              ></Image>
            </Link>
          </li>
        </ul>
        {session ? (
          <button
            className=" bg-border/90 p-2  rounded-full px-4 text-base font-medium font-sans text-white"
            onClick={signOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className=" bg-border/90 p-2  rounded-full px-4 text-base font-medium font-sans text-white"
            onClick={signIn}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
