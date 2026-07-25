import { prisma } from "@/lib/prisma";

// Deliberately not wrapped in React's `cache()` (unlike the dashboard readers in
// this folder): these run inside the Credentials `authorize` callback and the
// register route, not a render pass, and must always see fresh data.

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.passwordHash,
    },
    select: { id: true, name: true, email: true },
  });
}
