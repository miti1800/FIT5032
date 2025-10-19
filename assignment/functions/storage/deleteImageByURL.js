import * as functions from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
import { storage } from "../config/firebaseConfig.js";

export const deleteImageByURL = onCall(async (req) => {
  try {
    console.log("GOT the url!!!");
    const { publicURL } = req.data;
    if (!publicURL) throw new Error("Image URL is required.");

    console.log("After URL");
    let filePath = "";
      if (publicURL.includes("/uploads/")) {
        filePath = decodeURIComponent(publicURL.split("/uploads/")[1]);
        filePath = `uploads/${filePath}`;
      } else if (publicURL.includes("/o/")) {
        filePath = decodeURIComponent(publicURL.split("/o/")[1].split("?")[0]);
      } else {
        throw new Error("Invalid URL format.");
    }

    console.log("After URL Format and file path !!!");

    // const urlParts = publicURL.split("/o/");
    // if (urlParts.length < 2) throw new Error("Invalid URL format.");

    // const filePath = decodeURIComponent(urlParts[1].split("?")[0]);
    const bucket = storage.bucket();
    await bucket.file(filePath).delete();

    console.log("After file deleted !!!");

    return { success: true, message: "Image deleted successfully." };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new functions.https.HttpsError("internal", "Failed to delete image.", error);
  }
});