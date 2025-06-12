import { OAuth2Client } from "google-auth-library";

export async function generatePayload(idToken: string) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid google token");
  return payload;
}
