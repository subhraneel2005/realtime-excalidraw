import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value;
  return Response.json({ token });
}
