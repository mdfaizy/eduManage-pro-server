import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository.js";
import { TokenUtil } from "../../utils/token.util.js";
import { sendEmail } from "../../utils/sendEmail.js";
export class UserService {
  private repo = new UserRepository();

//  async createUser(payload: any, schoolId: number) {
//   const hashed = await bcrypt.hash(payload.password, 10);

//   // 1️⃣ Create user
//   const user = await this.repo.createUser({
//     name: payload.name,
//     email: payload.email.toLowerCase(),
//     password: hashed,
//     schoolId,
//     isActive: true,
//     emailVerified: true,
//   });

//   // 2️⃣ Assign role (IMPORTANT)
//   if (payload.roleId) {
//     await this.repo.assignRole(user.id, Number(payload.roleId));
//   }

//   return user;
// }

 async inviteUser(payload: any, schoolId: number) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) throw new Error("Email already registered");

    const user = await this.repo.createUser({
      name: payload.name,
      email: payload.email.toLowerCase(),
      schoolId,
      isActive: false,
      emailVerified: false,
      password: "TEMP", // placeholder
    });

    await this.repo.assignRole(user.id, payload.roleId);

    const rawToken = crypto.randomUUID();

    await this.repo.createToken({
      userId: user.id,
      tokenHash: TokenUtil.hash(rawToken),
      type: "SET_PASSWORD",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendEmail({
      email: user.email,
      subject: "Set your account password",
        html: `<a href="${process.env.FRONTEND_URL}/user-email-verify/${rawToken}">

              Set Password
            </a>`,
    });

    return user;
  }

  // 🔐 SET PASSWORD AFTER EMAIL CLICK
 async setPassword(token: string, password: string) {
    const record = await this.repo.findValidToken(TokenUtil.hash(token));
    if (!record) throw new Error("Invalid or expired token");

    const hashed = await bcrypt.hash(password, 10);

    await this.repo.activateUser(record.userId, hashed, record.id);
  }
async getUsers(schoolId: number, role?: string) {
  if (role) return this.repo.findByRole(schoolId, role);
  return this.repo.findAllBySchool(schoolId);
}

  async getUser(id: number) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async assignRole(userId: number, roleId: number) {
    return this.repo.assignRole(userId, roleId);
  }

  async deleteUser(id: number) {
    return this.repo.deleteUser(id);
  }
  async updateUserStatus(userId: number, isActive: boolean) {
    if (typeof isActive !== "boolean") {
      throw { statusCode: 400, message: "Invalid status value" };
    }

    const user = await this.repo.findById(userId);

    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }

    return await this.repo.updateStatus(userId, isActive);

  }
}




