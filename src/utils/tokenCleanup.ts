import prisma from "../config/prisma.js";

export const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.token.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // expired
          { isUsed: true },                  // already used
          { isRevoked: true },               // revoked
        ],
      },
    });

    console.log(`🧹 Deleted ${result.count} expired tokens`);
  } catch (err) {
    console.error("❌ Token cleanup failed:", err);
  }
};
