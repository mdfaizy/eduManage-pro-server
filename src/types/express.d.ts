import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: any; // simple for now
    }
  }
}

export {};
