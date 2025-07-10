"use client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import camera from "@/public/photo.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/api/video");
        setVideos(res.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  let count = 0;

  for (let index = 0; index < videos.length; index++) {
    const flags = videos[index].poseFlags;
    if (Array.isArray(flags)) {
      count += flags.length;
    }
  }
  const vidlen = videos.length;
  const chartConfig = {
    Videos: { label: "Videos", color: "#2563eb" },
    "Pose Issues": { label: "Pose Issues", color: "#60a5fa" },
  };

  const ChartData = [
    { name: "Videos", value: vidlen },
    { name: "Pose Issues", value: count },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col justify-center items-center p-4 bg-secondary-foreground w-fit rounded-md border-2 border-border/40">
          <span className="text-sm font-medium font-mono text-secondary">
            Videos
          </span>
          <span className="text-3xl font-bold font-mono text-secondary">
            {vidlen}
          </span>
        </div>
        <div className="flex flex-col justify-center items-center p-4 bg-secondary-foreground w-fit rounded-md border-2 border-border/40">
          <span className="text-sm font-medium font-mono text-secondary">
            Pose issues
          </span>
          <span className="text-3xl font-bold font-mono text-secondary">
            {count}
          </span>
        </div>
      </div>
      <h1 className="text-sm font-normal font-sans text-gray-400">
        MY POSTURE ANALYSIS
      </h1>
      <h1 className="text-3xl font-black font-mono mb-4">Overview.</h1>
      {loading ? (
        <div className="h-[30rem] flex flex-col justify-center items-center p-4 rounded-2xl bg-secondary-foreground text-lg font-mono font-semibold text-primary">
          <Loader className="h-20 w-20 animate-spin" /> Loading videos ...
        </div>
      ) : videos.length === 0 ? (
        <div className="h-[30rem] flex flex-col justify-center items-center p-4 rounded-2xl bg-secondary-foreground text-lg font-mono font-semibold text-primary">
          <Image src={camera} alt="" className="h-20 w-20 " /> No videos yet ...
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-start gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="p-4 rounded-xl border border-[rgba(255,255,255,0.10)] w-80  dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group"
            >
              <video
                src={video.url}
                controls
                className="w-full h-80 object-contain rounded-md mb-3"
              />
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-1 font-mono">
                  Pose Issues
                </h3>
                <p className="text-xs  text-gray-400 font-mono mb-1">
                  {new Date(video.createdAt).toDateString()}
                </p>
              </div>
              {video.poseFlags?.length > 0 ? (
                <ul className="text-sm text-amber-300 font-sans">
                  {video.poseFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-emerald-400 text-sm font-sans">
                  No issues detected
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <h1 className="text-sm font-normal font-sans text-gray-400 mt-6">
        CHART ANALYSIS
      </h1>
      <h1 className="text-3xl font-black font-mono mb-4">Overview.</h1>
      <ChartContainer config={chartConfig} className="w-9/12 pt-4 lg:w-8/12">
        <BarChart data={ChartData}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            barSize={80}
            radius={[4, 2, 1, 1]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
