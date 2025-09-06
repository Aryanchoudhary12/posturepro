"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import home from "@/public/home.png";
import { useSession, signIn, signOut } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";
function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between p-3 border-b border-b-primary/30 fixed z-50 w-full bg-background">
      <div className="title h-full ">
        <h1 className="text-2xl font-bold font-mono">
          Posture<span className="text-primary">Pro</span>
        </h1>
      </div>
      <div className="flex justify-center items-center gap-4 pr-4">
        <ul className=" gap-5 flex">
          <Link
            href="/"
            className={`flex justify-center items-center p-2 rounded-full border border-white/10 ${
              pathname == "/" ? "bg-primary/10" : ""
            }`}
          >
            <Image
              src={home}
              alt="home"
              height={400}
              width={400}
              className="h-4 w-4"
            ></Image>
          </Link>
          <Link
            href="/dashboard"
            className={`text-base font-MONO font-semibold flex justify-center items-center mr-2 ${
              pathname == "/dashboard" ? "text-primary" : "text-secondary"
            }`}
          >
            <LayoutDashboard/>
          </Link>
        </ul>
        {session ? (
          <button
            className=" relative flex items-center text-sm justify-center font-mono px-6 font-medium p-2 bg-gradient-to-r from-emerald-500 via-emerald-700 to-emerald-800 rounded-sm w-fit"
            onClick={signOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="relative flex items-center justify-center text-sm font-mono px-6 font-medium p-2 bg-gradient-to-r from-emerald-500 via-emerald-700 to-emerald-800 rounded-sm w-fit"
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
