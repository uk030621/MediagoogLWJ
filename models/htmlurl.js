//models/htmlurl.js
import mongoose from "mongoose";

const HtmlUrlSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional: For user-specific URLs
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Check if the model is already compiled to avoid recompiling
const HtmlUrl =
  mongoose.models.HtmlUrl || mongoose.model("HtmlUrl", HtmlUrlSchema);

export default HtmlUrl;
