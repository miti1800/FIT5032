import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

export const notifyUserOnProfileUpdate = onCall(
  { secrets: [SENDGRID_API_KEY] },
  async (req) => {
    try {
      const { data } = req;
      const { name, email, status } = data;

      if (!email || !name || !status) {
        throw new Error("Missing name, email, or status");
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      let subject = "";
      let bodyContent = "";

      if (status === "Active") {
        subject = "Your NutriEd Application Has Been Approved!";
        bodyContent = `
          <h2>Congratulations <b>${name}</b>!</h2>
          <p>We’re excited to inform you that your <b>Professional Dietitian</b> application has been <b>approved</b>.</p>
          <p>You can now log in to your NutriEd dashboard and start exploring tools and sharing recipes.</p>
          <p style="margin-top:15px;">Click below to access your account:</p>
          <p><a href="https://nutried.web.app/login" 
                style="display:inline-block;background-color:#284B63;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:10px;">
                Go to Dashboard
              </a></p>
          <p style="margin-top:20px;">We’re thrilled to have you on board!</p>
          <p style="margin-top:30px;">Warm regards,<br/><b>Team NutriEd</b></p>
        `;
      } else if (status === "Rejected") {
        subject = "Application Status Update – NutriEd";
        bodyContent = `
          <h2>Hello <b>${name}</b>,</h2>
          <p>We’ve reviewed your application, and unfortunately, it has been <b>rejected</b>.</p>
          <p>This may be due to incomplete or invalid information provided during your submission.</p>
          <p>If you believe this was an error, please feel free to <b>reply to this email</b> or resubmit your application with the correct details.</p>
          <p style="margin-top:20px;">We appreciate your interest in joining NutriEd and hope to hear from you again soon.</p>
          <p style="margin-top:30px;">Warm regards,<br/><b>Team NutriEd</b></p>
        `;
      } else {
        throw new Error("Invalid status value. Must be 'Active' or 'Rejected'.");
      }

      const msg = {
        to: email,
        from: "nutried000@gmail.com",
        subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>${subject}</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color:#f3f4f6; margin:0; padding:30px; color:#284B63;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff; border-radius:10px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                      <tr>
                        <td align="center">
                          ${bodyContent}
                          <hr style="margin-top:30px; border:none; border-top:1px solid #ddd;" />
                          <p style="font-size:13px; color:#888; margin-top:20px;">
                            © ${new Date().getFullYear()} NutriEd. All rights reserved.<br/>
                            Visit us at <a href="https://nutried.web.app" style="color:#284B63; text-decoration:none;">nutried.web.app</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      return { success: true, message: "Status email sent successfully" };
    } catch (error) {
      console.error("SendGrid Error:", error);
      throw new Error("Failed to send status email");
    }
  }
);