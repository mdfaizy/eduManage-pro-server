// import prisma from "../config/prisma.js";
// import { SchoolRepository } from "../repositories/school.repository.js";

// export const SchoolService = {
//   async activateSchoolAndUser(userId: number, schoolId: number) {
//     await prisma.$transaction([
//       prisma.user.update({
//         where: { id: userId },
//         data: { emailVerified: true },
//       }),
//       SchoolRepository.activate(schoolId),
//     ]);
//   },
// };



import prisma from "../../config/prisma.js";
import { SchoolRepository } from "./school.repository.js";

export const SchoolService = {
  async activateSchoolAndUser(userId: number, schoolId: number) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true, isActive: true },
      }),
      SchoolRepository.activate(schoolId),
    ]);
  },

  async getSchoolProfile(id: number) {
    const school = await SchoolRepository.findById(id);
    if (!school) throw new Error("School not found");
    return school;
  },

  async listSchools() {
    return SchoolRepository.list();
  },
};
