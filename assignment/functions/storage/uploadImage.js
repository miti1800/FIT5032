import { onRequest } from "firebase-functions/v2/https";
import { storage } from "../config/firebaseConfig.js";
import Busboy from "busboy";
import fs from "fs";

export const uploadImage = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

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
      if (!uploadData) return res.status(400).json({ error: "No file uploaded" });

      const { filePath, mimeType } = await uploadData;

      const bucket = storage.bucket();
      await bucket.upload(filePath, {
        destination: `uploads/${fileName}`,
        metadata: { contentType: mimeType },
      });

      const file = bucket.file(`uploads/${fileName}`);
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/uploads/${fileName}`;

      res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "File upload failed", details: error.message });
    }
  });

  busboy.end(req.rawBody);
});