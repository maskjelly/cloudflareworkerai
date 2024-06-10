'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";

export function Component() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setOverlayVisible(true); // Toggle the overlay animation
    const response = await fetch("https://workersai.aaryan-539.workers.dev?prompt=" + prompt);
    console.log("Prompt : "+prompt);
    const blob = await response.blob();
    setImage(URL.createObjectURL(blob));
    setOverlayVisible(false); // Toggle the overlay animation off
  };

  useEffect(() => {
    if (overlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
            (PS : This is a very base model so dont expect too much out of it .)
          </p>
          <form className="w-full max-w-md flex items-center gap-2" onSubmit={handleSubmit}>
            <Input className="flex-1" placeholder="Enter a prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <Button type="submit" >Generate</Button>
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
  transition={{ duration: 0.2 }}
>
  <div className="w-16 h-16 border-t-4 border-blue-500 border-solid animate-spin rounded-full"></div>
  <p className="text-white mt-4">Generating image...</p>
</motion.div>

    </div>
  )
}
