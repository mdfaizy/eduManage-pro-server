import prisma from "../config/prisma.js";

export const PlanRepository = {

    create(data: any) {
    return prisma.plan.create({ data });
  },

  list() {
    return prisma.plan.findMany();
  },

  assignToSchool(schoolId: number, planId: number) {
    return prisma.schoolSubscription.create({
      data: {
        schoolId,
        planId,
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // trial
      },
    });
  },
};
