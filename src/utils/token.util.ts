import crypto from "crypto";

export const TokenUtil = {
  generate() {
  return crypto.randomBytes(32).toString("hex"); // 🔥 MUST
},


  hash(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
