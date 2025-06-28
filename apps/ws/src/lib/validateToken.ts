import { auth } from "./auth";

async function validateSessionToken(token: string) {
  try {
    const mockHeaders = new Headers({
      cookie: `better-auth.session_token=${token}`,
    });

    const session = await auth.api.getSession({
      headers: mockHeaders,
    });

    return session;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export { validateSessionToken };
