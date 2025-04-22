"use client";

import * as faceapi from "face-api.js";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useMediaQuery } from "react-responsive";

import { FaceSchema } from "./type";

interface FaceDetectProps {
  id: string;
  setConfirmStep: (value: boolean) => void;
}

export function FaceDetect({ id, setConfirmStep }: FaceDetectProps) {
  const methods = useForm<FaceSchema>({
    defaultValues: {
      ModelsLoaded: false,
      faceDirection: "",
      lookingFor: "Straight",
    },
  });

  return (
    <FormProvider {...methods}>
      <FaceDetectFunction id={id} setConfirmStep={setConfirmStep} />
    </FormProvider>
  );
}

function FaceDetectFunction({ id, setConfirmStep }: FaceDetectProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isIOS, setIsIOS] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Check if device is iOS
  useEffect(() => {
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();

      return /iphone|ipad|ipod/.test(userAgent);
    };

    setIsIOS(checkIsIOS());
  }, []);

  // Optimize detection intervals based on device
  const DETECTION_INTERVAL = useMemo(() => (isMobile ? 200 : 150), [isMobile]);
  // Reduce model size for mobile
  const TINY_FACE_DETECTOR_OPTIONS = useMemo(() => {
    return new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.2,
    });
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 720, height: 560 });
  const [circleSize, setCircleSize] = useState({ width: 192, height: 192 }); // Initial size for circle (in pixels)
  const [progress, setProgress] = useState<Record<string, number>>({
    Straight: 0,
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0,
  });

  const { control, setValue } = useFormContext<FaceSchema>();

  const isModelsLoaded = useWatch({ control, name: "ModelsLoaded" });
  const faceDirection = useWatch({ control, name: "faceDirection" });
  const lookingFor = useWatch({ control, name: "lookingFor" });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastCaptureTime = useRef<number>(0);
  const captureDebounceTime = isMobile ? 200 : 150;
  const streamRef = useRef<MediaStream | null>(null);
  const processingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const publicDir = process.env.NEXT_PUBLIC_PUBLIC_URL;

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = (containerWidth * 3) / 4;

        // For mobile, reduce dimensions slightly
        const scaleFactor = isMobile ? 0.9 : 1;
        const newWidth = containerWidth * scaleFactor;
        const newHeight = containerHeight * scaleFactor;

        setDimensions({
          width: newWidth,
          height: newHeight,
        });

        // IMPORTANT FIX: Force circle to be perfectly round
        // Use width only for diameter calculation (ignore height)

        const circleDiameter = Math.min(newWidth, newWidth) * 0.65;

        setCircleSize({
          width: circleDiameter,
          height: circleDiameter,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = publicDir + "/models";

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setValue("ModelsLoaded", true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateFacePose = (landmarks: faceapi.FaceLandmarks68) => {
    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const noseTop = nose[3];
    const noseBottom = nose[6];

    const leftEyeCenter = {
      x:
        leftEye.reduce(
          (sum: number, point: faceapi.Point) => sum + point.x,
          0
        ) / leftEye.length,
      y:
        leftEye.reduce(
          (sum: number, point: faceapi.Point) => sum + point.y,
          0
        ) / leftEye.length,
    };
    const rightEyeCenter = {
      x:
        rightEye.reduce(
          (sum: number, point: faceapi.Point) => sum + point.x,
          0
        ) / rightEye.length,
      y:
        rightEye.reduce(
          (sum: number, point: faceapi.Point) => sum + point.y,
          0
        ) / rightEye.length,
    };

    const eyeDistance = rightEyeCenter.x - leftEyeCenter.x;
    const noseCenterX = (noseTop.x + noseBottom.x) / 2;
    const eyesCenterX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
    const yaw = ((noseCenterX - eyesCenterX) / eyeDistance) * 100;

    const eyeLevel = (leftEyeCenter.y + rightEyeCenter.y) / 2;
    const noseHeight = noseBottom.y - noseTop.y;
    const pitch = ((noseBottom.y - eyeLevel) / noseHeight - 1.5) * 50;

    return { yaw, pitch };
  };

  const getFaceDirection = ({ yaw, pitch }: { yaw: number; pitch: number }) => {
    if (!isMobile) {
      if (pitch < 90 && yaw >= -2 && yaw <= 15) return "Up";
      if (pitch > 170 && yaw >= -2 && yaw <= 15) return "Down";
      if (yaw < 0) return "Right";
      if (yaw > 15) return "Left";

      return "Straight";
    }

    if (pitch < 90 && yaw >= -10 && yaw <= 15) return "Up";
    if (pitch > 170 && yaw >= -10 && yaw <= 15) return "Down";
    if (yaw < -20) return "Right";
    if (yaw > 20) return "Left";

    return "Straight";
  };

  const isFirstCapture = useRef(true);

  // Improve captureAndSaveFrameFromVideo
  const captureAndSaveFrameFromVideo = async (
    boundingBox: faceapi.Box,
    count: number,
    direction: string
  ): Promise<boolean> => {
    const currentTime = Date.now();
    if (currentTime - lastCaptureTime.current < captureDebounceTime)
      return false;
    if (!videoRef.current) return false;

    const video = videoRef.current;

    try {
      // Always use the intrinsic video size for cropping
      const videoW = video.videoWidth;
      const videoH = video.videoHeight;

      // Calculate scaling factors between detection (display) and actual video
      const scaleX = videoW / video.width;
      const scaleY = videoH / video.height;

      // Convert bounding box coordinates to intrinsic video coordinates
      const boxX = boundingBox.x * scaleX;
      const boxY = boundingBox.y * scaleY;
      const boxW = boundingBox.width * scaleX;
      const boxH = boundingBox.height * scaleY;

      // CRITICAL FIX: Force square crop to prevent stretching
      // Center and side length for square crop (use max of width/height)
      const centerX = boxX + boxW / 2;
      const centerY = boxY + boxH / 2;

      // const sideLength = Math.max(boxW, boxH) * faceMultiplier;
      const sideLength =
        Math.max(boxW, boxH) * (isFirstCapture.current ? 1.5 : 1); // Larger for first capture (main.jpg)

      // Ensure crop stays within video bounds as a perfect square
      const cropX = Math.max(0, centerX - sideLength / 2);
      const cropY = Math.max(0, centerY - sideLength / 2);
      const cropSize = Math.min(sideLength, videoW - cropX, videoH - cropY);

      // Use exact same width and height for a perfect square crop
      const cropW = cropSize;
      const cropH = cropSize;

      // Prepare output canvas
      const isOffscreenCanvasSupported = typeof OffscreenCanvas !== "undefined";
      let outputCanvas: OffscreenCanvas | HTMLCanvasElement;
      if (isOffscreenCanvasSupported) {
        outputCanvas = new OffscreenCanvas(224, 224);
      } else {
        outputCanvas = document.createElement("canvas");
        outputCanvas.width = 224;
        outputCanvas.height = 224;
      }

      const ctx = outputCanvas.getContext("2d") as
        | CanvasRenderingContext2D
        | OffscreenCanvasRenderingContext2D;
      if (!ctx) return false;

      // Draw the crop to the output canvas, stretching to 224x224
      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, 224, 224);

      // Convert to blob
      if (isOffscreenCanvasSupported) {
        const blob = await (outputCanvas as OffscreenCanvas).convertToBlob({
          type: "image/jpeg",
          quality: 0.9,
        });

        const imageName = isFirstCapture.current
          ? "main.jpg"
          : `${direction}-${Date.now()}.jpg`;

        const formData = new FormData();
        formData.append("image", blob, imageName);
        formData.append("name", id);

        try {
          const response = await fetch("/api/save-image", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            lastCaptureTime.current = currentTime;
            setProgress((prev) => ({
              ...prev,
              [direction]: Math.min((prev[direction] || 0) + 20, 100),
            }));

            if (isFirstCapture.current) {
              isFirstCapture.current = false;
            }

            return true;
          }
          return false;
        } catch (error) {
          console.error("Error sending image:", error);
          return false;
        }
      } else {
        return new Promise<boolean>((resolve) => {
          (outputCanvas as HTMLCanvasElement).toBlob(
            (b) => {
              if (!b) {
                resolve(false);
                return;
              }

              // Continue with your existing code for sending the blob
              const imageName = isFirstCapture.current
                ? "main.jpg"
                : `${direction}-${Date.now()}.jpg`;

              const formData = new FormData();
              formData.append("image", b, imageName);
              formData.append("name", id);

              fetch("/api/save-image", {
                method: "POST",
                body: formData,
              })
                .then((response) => {
                  if (response.ok) {
                    lastCaptureTime.current = currentTime;
                    setProgress((prev) => ({
                      ...prev,
                      [direction]: Math.min((prev[direction] || 0) + 20, 100),
                    }));

                    if (isFirstCapture.current) {
                      isFirstCapture.current = false;
                    }

                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
                .catch(() => resolve(false));
            },
            "image/jpeg",
            0.9
          );
        });
      }
    } catch (error) {
      console.error("Error capturing frame:", error);
      return false;
    }
  };

  const handleVideoPlay = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };

    // Set canvas size to match video size
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    faceapi.matchDimensions(canvas, displaySize);

    const counts: Record<string, number> = {
      straight: 0,
      left: 0,
      right: 0,
      up: 0,
      down: 0,
    };

    const captureSequence = [
      { direction: "Straight", target: 6 },
      { direction: "Left", target: 5 },
      { direction: "Right", target: 5 },
      { direction: "Up", target: 5 },
      { direction: "Down", target: 5 },
    ];

    let currentStageIndex = 0;
    let frameSkipCount = 0;

    const intervalId = setInterval(async () => {
      if (processingRef.current) return;

      if (isMobile && !isIOS) {
        frameSkipCount = (frameSkipCount + 1) % 2;
        if (frameSkipCount !== 0) return;
      }

      try {
        processingRef.current = true;

        const detections = await faceapi
          .detectAllFaces(video, TINY_FACE_DETECTOR_OPTIONS)
          .withFaceLandmarks();

        if (detections.length >= 2) {
          setValue("faceDirection", "Multiple faces detected");
          processingRef.current = false;

          return;
        }

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const context = canvas.getContext("2d");

        if (!context) {
          processingRef.current = false;

          return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (resizedDetections.length === 0) {
          setValue("faceDirection", "No face detected");
          processingRef.current = false;

          return;
        }

        if (!isMobile) {
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        const pose = calculateFacePose(resizedDetections[0].landmarks);
        const currentDirection = getFaceDirection(pose);

        setValue("faceDirection", currentDirection);

        const currentStage = captureSequence[currentStageIndex];

        if (!currentStage) {
          clearInterval(intervalId);
          setValue("lookingFor", "Done capturing all images");
          setIsDone(true);
          processingRef.current = false;

          setConfirmStep(true);
          stopWebcam(); // Add this line to stop the webcam
          return;
        }

        setValue("lookingFor", currentStage.direction);

        // Release processing lock before capture attempt
        processingRef.current = false;

        if (currentDirection === currentStage.direction) {
          const directionKey = currentStage.direction.toLowerCase();
          const boundingBox = resizedDetections[0].detection.box;

          const captured = await captureAndSaveFrameFromVideo(
            boundingBox,
            counts[directionKey],
            currentStage.direction
          );

          if (captured) {
            counts[directionKey]++;
            if (counts[directionKey] === currentStage.target) {
              currentStageIndex++;

              // Trigger vibration on mobile
              if (isMobile && navigator.vibrate) {
                navigator.vibrate(200); // Rung 200ms
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in face detection:", error);
        processingRef.current = false;
      }
    }, DETECTION_INTERVAL);

    intervalRef.current = intervalId;

    return () => clearInterval(intervalId);
  };

  // Function to stop the webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Update your camera activation useEffect
  useEffect(() => {
    if (isModelsLoaded && videoRef.current && !isDone) {
      const activateCamera = async () => {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: "user",
          },
        };

        // Special handling for iOS devices
        if (isIOS) {
          // Force hardware acceleration for iOS
          if (videoRef.current) {
            videoRef.current.setAttribute("playsinline", "true");
            videoRef.current.setAttribute("webkit-playsinline", "true");
          }
        }

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              streamRef.current = stream;

              // For iOS, we need to call play() after setting srcObject
              if (isIOS) {
                videoRef.current.play().catch((error) => {
                  console.error("Error playing video:", error);
                });
              }
            }
          })
          .catch((error) => {
            console.error("Error accessing camera:", error);
          });
      };

      activateCamera();
    }

    return () => {
      stopWebcam();
    };
  }, [isModelsLoaded, isDone, isIOS]);

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-y-3">
        <div className="text-center flex flex-col gap-y-3">
          {faceDirection === lookingFor ? (
            <h1 className="text-xl text-green-500 font-bold">Hold still!</h1>
          ) : (
            <h1 className="text-xl text-red-500 font-bold">
              Turn to: {lookingFor}
            </h1>
          )}
        </div>

        {/* Progress bars */}
        <div className="grid grid-cols-5 gap-2 px-4 mb-4">
          {Object.entries(progress).map(([direction, value]) => (
            <div key={direction} className="flex flex-col items-center">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className={`${isMobile ? "text-xs" : "text-sm"} mt-1`}>
                {
                  {
                    Straight: "Straight",
                    Left: "Left",
                    Right: "Right",
                    Up: "Up",
                    Down: "Down",
                  }[direction]
                }
              </span>
            </div>
          ))}
        </div>

        <div
          className={`relative rounded-2xl ${
            faceDirection === lookingFor
              ? "shadow-2xl shadow-green-500/50"
              : "shadow-2xl shadow-red-500/50"
          }`}
        >
          <video
            ref={videoRef}
            className="rounded-2xl w-full h-full object-cover"
            height={dimensions.height}
            style={{ transform: isMobile ? "scaleX(-1)" : "none" }}
            width={dimensions.width}
            onPlay={handleVideoPlay}
            autoPlay
            playsInline
            muted
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            height={dimensions.height}
            style={{ transform: isMobile ? "scaleX(-1)" : "none" }}
            width={dimensions.width}
          />

          {/* Focus circle for mobile */}
          {/* Updated responsive focus circle for mobile */}
          {isMobile && (
            <>
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <mask id="center-circle-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <circle
                      cx={dimensions.width / 2}
                      cy={dimensions.height / 2}
                      r={circleSize.width / 3}
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="black"
                  opacity="0.7"
                  mask="url(#center-circle-mask)"
                />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
