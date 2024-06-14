import mongoose from "mongoose";
import UserPrompts from "./userPrompts";

// Enable Mongoose debugging for more detailed logs
mongoose.set("debug", true);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Adjust as necessary
    },
  },
};

export default async function handler(req, res) {
  console.log("API Route Hit");

  if (req.method === "POST") {
    const { prompt, image } = req.body; // Assume image is base64 encoded
    console.log("Request Body:", req.body);

    try {
      let existingPrompt = await UserPrompts.findOne({ prompt });

      if (existingPrompt) {
        existingPrompt.count += 1;
        existingPrompt.lastSaved = Date.now();
        existingPrompt.image = image; // Update image
        await existingPrompt.save();
        console.log("Prompt Updated Successfully");
        res
          .status(200)
          .json({
            message: "Prompt updated successfully",
            prompt: existingPrompt,
          });
      } else {
        const newPrompt = new UserPrompts({ prompt, image });
        await newPrompt.save();
        console.log("Prompt Saved Successfully");
        res
          .status(201)
          .json({ message: "Prompt saved successfully", prompt: newPrompt });
      }
    } catch (error) {
      console.error("Error Saving Prompt:", error);
      res.status(500).json({ message: "Error saving prompt", error });
    }
  } else {
    console.log("Invalid Method");
    res.status(405).json({ message: "Method not allowed" });
  }
}
