import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import Busboy from "busboy";
import fs from "fs";

initializeApp();
const storage = getStorage();

export const uploadImage = onRequest(async (req, res) => {
  // Add CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  console.log("Inside upload image");

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const busboy = Busboy({ headers: req.headers });
  let uploadData = null;
  let fileName = "";

  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;
    fileName = `${Date.now()}_${filename}`;
    const filePath = `/tmp/${fileName}`;

    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);

    uploadData = new Promise((resolve, reject) => {
      writeStream.on("finish", () => resolve({ filePath, mimeType }));
      writeStream.on("error", reject);
    });
  });

  busboy.on("finish", async () => {
    try {
      if (!uploadData) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      uploadData = await uploadData;

      const bucket = storage.bucket(); 
      await bucket.upload(uploadData.filePath, {
        destination: `uploads/${fileName}`,
        metadata: { contentType: uploadData.mimeType },
      });

      const file = bucket.file(`uploads/${fileName}`);
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/uploads/${fileName}`;

      console.log("File uploaded successfully:", publicUrl);
      res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "File upload failed", details: error.message });
    }
  });

  busboy.end(req.rawBody);
});