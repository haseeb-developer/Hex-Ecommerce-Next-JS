// Shared in-memory storage for users
// In production, replace this with a proper database (Prisma, MongoDB, etc.)

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, hash passwords!
  createdAt: string;
}

// Use a global variable to persist users across API routes
// In production, use a database instead
declare global {
  var __users: User[] | undefined;
}

if (!global.__users) {
  global.__users = [];
}

export const users: User[] = global.__users;

