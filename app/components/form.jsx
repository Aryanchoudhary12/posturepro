"use client";
import toast, { Toaster } from "react-hot-toast";
import { useRef, useEffect, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import Image from "next/image";
import upload from "@/public/cloud-upload.png";
import camera from "@/public/photo.png";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { uploadToCloudinary } from "@/lib/uploadtocloudinary";
export default function Form() {
  const inputref = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const uploadedVideoRef = useRef(null);
  const router = useRouter();

  const [landmarker, setLandmarker] = useState(null);
  const [running, setRunning] = useState(false);
  const [videourl, setVideourl] = useState(null);
  const [videoElement, setVideoElement] = useState(null);
  const [submitting, setsubmitting] = useState(false);

  // Load Mediapipe Landmarker
  useEffect(() => {
    const loadLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      const lm = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      setLandmarker(lm);
    };

    loadLandmarker();
  }, []);

  // Analyze uploaded video and return pose flags
  const analyzeUploadedVideo = () => {
    return new Promise((resolve) => {
      const video = uploadedVideoRef.current;
      if (!landmarker || !video) return resolve([]);

      const tempFlags = new Set();

      const process = async () => {
        if (video.paused || video.ended) {
          resolve(Array.from(tempFlags));
          return;
        }

        const now = performance.now();
        const result = await landmarker.detectForVideo(video, now);
        // rule based analysis
        if (result.landmarks.length > 0) {
          const landmarks = result.landmarks[0];
          const nose = landmarks[0];
          const leftShoulder = landmarks[11];
          const leftHip = landmarks[23];
          const leftKnee = landmarks[25];
          const leftToe = landmarks[31];

          const dx = leftShoulder.x - leftHip.x;
          const dy = leftShoulder.y - leftHip.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          if (angle > 25) tempFlags.add("Slouching detected");
          if (leftKnee.x > leftToe.x + 0.03) tempFlags.add("Knee over toe");
          if (nose.x < leftShoulder.x - 0.08)
            tempFlags.add("Forward head posture");
        }

        requestAnimationFrame(process);
      };

      video.play();
      requestAnimationFrame(process);
    });
  };

  // Webcam Posture Detection
  useEffect(() => {
    if (!landmarker || !running) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const utils = new DrawingUtils(ctx);

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        detect();
      };
    };

    let lastTime = -1;
    const detect = async () => {
      if (!running) return;

      const time = performance.now();
      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        // rule based analysis for webcam
        landmarker.detectForVideo(video, time, (result) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (result.landmarks.length > 0) {
            const landmarks = result.landmarks[0];
            const nose = landmarks[0];
            const leftShoulder = landmarks[11];
            const leftHip = landmarks[23];
            const leftKnee = landmarks[25];
            const leftToe = landmarks[31];

            const flags = [];

            const dx = leftShoulder.x - leftHip.x;
            const dy = leftShoulder.y - leftHip.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            if (angle > 25) flags.push("Slouching detected");
            if (leftKnee.x > leftToe.x + 0.03) flags.push("Knee over toe");
            if (nose.x < leftShoulder.x - 0.08)
              flags.push("Forward head posture");

            utils.drawLandmarks(landmarks);
            utils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);

            ctx.fillStyle = flags.length > 0 ? "red" : "green";
            ctx.font = "16px Arial";
            ctx.fillText(flags.join(", ") || "Good Posture", 10, 20);
          }
        });
      }

      requestAnimationFrame(detect);
    };

    start();
  }, [landmarker, running]);

  // Handle form submit
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    try {
      setsubmitting(true);
      if (!videourl) return toast.error("Please select a video");

      const flags = await analyzeUploadedVideo(); // ✅ wait for pose flags
      const cloudUrl = await uploadToCloudinary(videourl);
      const formdata = new FormData();
      formdata.append("url", cloudUrl);
      formdata.append("poseFlags", JSON.stringify(flags));

      await axios.post("/api/new", formdata);

      toast.success("Video uploaded successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setsubmitting(false);
    }
  };

  return (
    <div>
      <Toaster />
      <div className="mt-4 flex flex-wrap gap-4">
        <form
          className="flex gap-1 p-1 border border-[rgba(255,255,255,0.15)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.1)_inset] rounded-sm w-fit backdrop-blur-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className="flex items-center justify-center gap-2 px-4 font-sans font-medium "
            onClick={() => inputref.current.click()}
          >
            <Image src={upload} alt="upload" className="h-6 w-6" />
            Add Video
          </div>
          <input
            className="hidden"
            ref={inputref}
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setVideourl(file);
                const url = URL.createObjectURL(file);
                setVideoElement(url);
              }
            }}
          />
          <button
            type="submit"
            className="flex justify-center items-center gap-2 bg-border p-2 rounded-sm font-sans text-white font-medium px-4 hover:bg-border/80 transition-all"
          >
            Submit{" "}
            {submitting ? <Loader className="h-5 w-5 animate-spin" /> : ""}
          </button>
        </form>

        <button
          className="relative flex items-center justify-center gap-2 px-4 font-sans font-medium p-2 bg-gradient-to-r from-emerald-500 via-emerald-700 to-emerald-800 rounded-sm w-fit"
          onClick={() => setRunning((prev) => !prev)}
        >
          <Image src={camera} alt="" className="h-6 w-6" />
          {running ? "Stop" : "Start"} Webcam
        </button>
      </div>

      {/* Webcam Preview */}
      {running ? (
        <div className="relative py-4">
          <video ref={videoRef} className="w-[480px] h-[360px] rounded-xl" />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-[480px] h-[360px]"
          />
        </div>
      ) : (
        <div className="relative py-4">
          <div className="max-w-[480px] h-[360px] backdrop-blur-lg border border-white/10 rounded-xl shadow-[2px_4px_16px_0px_rgba(248,248,248,0.1)_inset] bg-white/5 flex flex-col justify-center items-center" >
            <Image src={camera} alt="camera" className="h-28 w-28"></Image>
            <p className="font-mono font-medium">Press &quot;Start Webcam&quot; button to start .</p>
          </div>
        </div>
      )}

      {/* Hidden video for analysis */}
      {videoElement && (
        <video
          ref={uploadedVideoRef}
          src={videoElement}
          className="hidden"
          playsInline
          muted
          onLoadedMetadata={() => {
            uploadedVideoRef.current.currentTime = 0;
          }}
        />
      )}
    </div>
  );
}
