import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/auth-schemas";
import { createUser, getUserByEmail } from "@/lib/db/users";

// Same cost factor as `prisma/seed.ts`, so seeded and registered users hash
// identically.
const BCRYPT_ROUNDS = 12;

// An API route rather than a Server Action: registration is a public endpoint
// that future CLI/mobile clients will call, and it needs real HTTP status codes.
// This static segment takes precedence over the `[...nextauth]` catch-all.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  try {
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    if (await getUserByEmail(email)) {
      return NextResponse.json(
        { success: false, error: "An account with that email already exists" },
        { status: 409 },
      );
    }

    const user = await createUser({
      name,
      email,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("[register] failed to create user", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
