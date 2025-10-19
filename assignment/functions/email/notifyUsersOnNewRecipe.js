import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import sgMail from "@sendgrid/mail";
import { db } from "../config/firebaseConfig.js";

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

export const notifyUsersOnNewRecipe = onDocumentCreated(
  {
    document: "recipes/{recipeId}",
    secrets: [SENDGRID_API_KEY],
  },
  async (event) => {
    const recipeData = event.data?.data();
    if (!recipeData) return;

    console.log("New recipe added:", recipeData.recipe_name);

    try {
        sgMail.setApiKey(SENDGRID_API_KEY.value());

      const usersSnapshot = await db.collection("users").where("subscribe", "==", true).get();
      if (usersSnapshot.empty) {
        console.log("No subscribed users found.");
        return;
      }

      const recipients = usersSnapshot.docs
        .map((doc) => doc.data().email)
        .filter((email) => !!email);

      console.log(`Sending email to ${recipients.length} users`);

      const { recipe_name, image, author_name } = recipeData;
      const recipeUrl = "https://fit-5032-hazel.vercel.app/login";

      const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Recipe Added</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height:1.6; color:#284B63; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding: 20px;">
      <tr>
        <td>
          <table width="600" cellpadding="0" cellspacing="0" align="center" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding:30px;">
                <h2>New Recipe Added: ${recipe_name}</h2>
                <p style="font-size:16px;">By <strong>${author_name}</strong></p>
                <img src="${image}" 
                     alt="${recipe_name}" 
                     width="100%" 
                     style="max-width:400px; display:block; border-radius:10px; margin-bottom:10px;" />
                <p style="margin-top:15px;">Check out the latest recipe on our website!</p>
                <a href="${recipeUrl}" 
                   style="background:#284B63; color:#f3f4f6; padding:10px 20px; text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">
                   View Recipe
                </a>
                <p style="margin-top:20px; color:gray;">
                  If you no longer wish to receive updates, you can unsubscribe in your account settings.
                </p>
                <p style="margin-top:30px;">Warm regards,<br/><b>Team NutriEd</b></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

      const msg = {
        to: recipients,
        from: "nutried000@gmail.com",
        subject: `New Recipe Alert: ${recipe_name}`,
        html: htmlContent,
      };

      await sgMail.sendMultiple(msg);
      console.log("Emails sent successfully!");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  }
);