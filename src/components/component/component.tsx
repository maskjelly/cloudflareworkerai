'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { saveAs } from 'file-saver';

export function Component() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState('');
  const [imageBlob, setImageBlob] = useState<Blob | null>(null); // State to store image blob
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(10);
  const [timeExceeded, setTimeExceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setOverlayVisible(true); // Toggle the overlay animation
    setElapsedTime(10); // Reset the timer
    setTimeExceeded(false); // Reset the time exceeded flag

    const response = await fetch("https://workersai.aaryan-539.workers.dev?prompt=" + prompt);
    console.log("Prompt : " + prompt);
    const blob = await response.blob();

    setImageBlob(blob); // Store the blob
    setImage(URL.createObjectURL(blob));
    setOverlayVisible(false); // Toggle the overlay animation off
  };

  const handleDownload = () => {
    if (imageBlob) {
      saveAs(imageBlob, 'generated-image.png');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (overlayVisible) {
      document.body.style.overflow = "hidden";
      intervalId = setInterval(() => {
        setElapsedTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            setTimeExceeded(true);
            return 0;
          }
        });
      }, 1000); // Update every second
    } else {
      document.body.style.overflow = "auto";
      if (intervalId !== null) clearInterval(intervalId);
    }

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [overlayVisible]);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="grid gap-8 md:gap-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Generate Stunning Images</h1>
          <p className="max-w-md text-gray-500 dark:text-gray-400 text-center">
            Enter a prompt and let our AI generate a unique and captivating image for you.
          </p>
          <p className="font-bold text-center">
            (PS: This is a very base model so don't expect too much out of it.)
          </p>
          <form className="w-full max-w-md flex items-center gap-2" onSubmit={handleSubmit}>
            <Input className="flex-1" placeholder="Try generating - Cyberpunk Cat " type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <Button type="submit">Generate</Button>
          </form>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <img
            alt="Generated Image"
            className="w-full h-auto object-cover"
            height="500"
            src={image ? image : "/placeholder.svg"}
            style={{
              aspectRatio: "800/500",
              objectFit: "cover",
            }}
            width="800"
          />
        </div>
          {image && (
            <div className="flex justify-center mt-1">
              <Button onClick={handleDownload}>Download Image</Button>
            </div>
          )}
      </div>
      <footer>
        Created by Aaryan AKA - Whiteye
      </footer>

      <motion.div
        className="fixed inset-0 bg-gray-900 opacity-75 flex flex-col items-center justify-center"
        animate={overlayVisible ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: { opacity: 1, pointerEvents: "auto" },
          hidden: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid animate-spin rounded-full"></div>
        <p className="text-white mt-4">
          {timeExceeded ? "Almost done - might take a few more seconds" : `Generating image - Time Elapsed: ${10 - elapsedTime} seconds`}
        </p>
      </motion.div>
    </div>
  );
}
