import prisma from "../../config/prisma.js";

export const SchoolRepository = {
  activate(schoolId: number) {
    return prisma.school.update({
      where: { id: schoolId },
      data: { status: "ACTIVE" },
    });
  },

  findById(id: number) {
    return prisma.school.findUnique({
      where: { id },
      include: {
        users: true,
        subscriptions: true,
      },
    });
  },

  list() {
    return prisma.school.findMany();
  },
};
