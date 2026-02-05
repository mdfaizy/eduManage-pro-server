import jwt from "jsonwebtoken";

export const JWTService = {
  generateAccessToken(data: {
    userId: number;
    schoolId: number;
    roles: string[];
    permissions: string[];
  }) {
    return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "2h" });
  },

  verify(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  },
};
