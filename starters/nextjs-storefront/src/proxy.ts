import { NextResponse } from "next/server";

// Passthrough proxy. This file exists so that, when this starter lives inside
// the Reponse monorepo, Next.js picks it up instead of the main app's
// proxy.ts at the workspace root (Turbopack roots the build at the pnpm
// lockfile). Standalone installs are unaffected. Add your own logic if needed.
export default function proxy() {
  return NextResponse.next();
}
