// In-memory auth store for standalone environment
export type User = {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: "student" | "employer";
  createdAt: string;
};

// Global cache to persist across route invocations in dev server
const globalForAuth = globalThis as unknown as {
  __authUsers?: User[];
};

if (!globalForAuth.__authUsers) {
  globalForAuth.__authUsers = [
    {
      id: "demo-student-1",
      fullName: "Hansaja Damneth",
      email: "hansaja.damneth@email.com",
      password: "password123",
      role: "student",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-employer-1",
      fullName: "Tech Solutions Admin",
      email: "contact@techsolutions.lk",
      password: "password123",
      role: "employer",
      createdAt: new Date().toISOString(),
    },
  ];
}

export const users = globalForAuth.__authUsers;

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(userData: {
  fullName: string;
  email: string;
  password?: string;
  role?: "student" | "employer";
}) {
  const newUser: User = {
    id: `user-${Date.now()}`,
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password || "password123",
    role: userData.role || "student",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}
