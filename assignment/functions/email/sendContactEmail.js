import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import sgMail from "@sendgrid/mail";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

export const sendContactEmail = onCall(
  { secrets: [SENDGRID_API_KEY] },
  async (req) => {
    try {
        const { data } = req;
        const { name, email, message, subject } = data;

        if (!email || !name) throw new Error("Missing name or email");

        console.log("SendGrid API Key loaded?", !!process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        const pdfEnd = new Promise((resolve) => doc.on("end", resolve));

        doc
            .rect(0, 0, doc.page.width, 60)
            .fill("#284B63");
        doc
            .font("Helvetica-Bold")
            .fillColor("#ffffff")
            .fontSize(20)
            .text("NutriEd", 30, 20, { align: "left" });

        doc.moveDown(2);

        doc.font("Helvetica-Bold").fontSize(14).fillColor("#284B63").text("Contact Form Submission Details");
        doc.moveDown(0.2);
        doc
        .strokeColor("#284B63")
        .lineWidth(2)
        .moveTo(30, doc.y)
        .lineTo(doc.page.width - 30, doc.y)
        .stroke();

        doc.moveDown(1);
        const labelStyle = { continued: true };
        const valueStyle = { continued: false };

        doc.fontSize(12);
        doc.fillColor("#284B63").font("Helvetica-Bold").text("Name: ", labelStyle).fillColor("#515E66").font("Helvetica").text(name, valueStyle);
        doc.fillColor("#284B63").font("Helvetica-Bold").text("Email: ", labelStyle).fillColor("#515E66").font("Helvetica").text(email, valueStyle);
        doc.fillColor("#284B63").font("Helvetica-Bold").text("Message: ", labelStyle).fillColor("#515E66").font("Helvetica").text(message, {
                continued: false,
                align: "justify",
                width: doc.page.width - 100,
            });

        doc.moveDown(3);

        doc
            .fontSize(10)
            .fillColor("#7A8A97")
            .text("Thank you for contacting NutriEd!", { align: "center" })
            .text("For urgent inquiries, call 0468 349 590", { align: "center" })
            .text("www.nutried.com", { align: "center", link: "https://nutried.com" });

        doc.end();
        await pdfEnd;

        const pdfBuffer = Buffer.concat(buffers);
        const base64PDF = pdfBuffer.toString("base64");

        const msg = {
            to: email,
            from: "nutried000@gmail.com",
            subject: subject || "Your Contact Form Submission",
            text: `Hi ${name},\n\nHere’s what you submitted:\n\n${message}`,
            html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Contact Form Submission</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height:1.6; color:#284B63; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding: 20px;">
      <tr>
        <td>
          <table width="600" cellpadding="0" cellspacing="0" align="center" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding:30px;">
                <h2>Hello ${name},</h2>
                <p style="font-size:16px;">Thank you for reaching out to NutriEd!</p>
                <p style="margin-top:5px;">We’ve received your message and our team will get back to you within 1–2 business days.</p>
                <p style="margin-top:15px;">If your inquiry is urgent, please don’t hesitate to call us directly at <b>0468 349 590</b> — we’re always happy to help.</p>
                <p style="margin-top:15px;">In the meantime, feel free to explore nutritious recipes on https://fit-5032-hazel.vercel.app/login.</p>
                <p style="margin-top:20px;">We’ve also attached a copy of your query for your records.</p>
                <p style="margin-top:30px;">Warm regards,<br/><b>Team NutriEd</b></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
            attachments: [
                {
                    content: base64PDF,
                    filename: "contact_submission.pdf",
                    type: "application/pdf",
                    disposition: "attachment",
                },
            ],
        };

        await sgMail.send(msg);
        return { success: true, message: "Email sent successfully" };

    } catch (error) {
        console.error("SendGrid Full Error:", error);
        throw new Error("Email sending failed");
    }
});