"use client";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Form from "./components/form";
import pose from "@/public/pose.png";
import { Boxes } from "@/components/ui/background-boxes";
export default function Home() {
  return (
    <div className="bg-gradient-to-b from-background via-secondary-foreground to-background w-full">
      <div className="relative w-full min-h-screen  h-full overflow-hidden p-2">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-background via-secondary-foreground to-background">
          <Boxes />
        </div>
        <div className="relative flex justify-start items-start h-full pl-10">
          <div className="relative w-10/12 lg:w-full mt-10">
            <h1 className="text-5xl font-extrabold font-mono leading-14">
              Improve Your <span className="text-primary">Posture</span> with
              Smart Video Analysis
            </h1>
            <p className="mt-4 text-lg font-normal font-sans text-gray-300">
              Upload your workout or sitting video — get instant, rule-based
              feedback on slouching, knee-over-toe, and other posture issues.
              PosturePro is your AI-powered posture assistant. Whether you are
              squatting, working at a desk, or exercising, we analyze your
              movements in real time to help you avoid injuries and build better
              habits — no wearables needed.
            </p>
            <div className="flex text-base mt-4  items-center gap-2 font-mono ">
              <ExternalLink className="h-6 w-6" /> Try it now
            </div>
            <Form />
          </div>
          <div className="hidden relative lg:flex justify-center items-center w-full">
            <Image
              src={pose}
              alt="pose"
              className="h-[25rem] w-[25rem]"
              height={400}
              width={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
