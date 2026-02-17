import prisma from "../../config/prisma";

export const createDayRepo = async (data: any) => {
  return prisma.day.create({ data });
};

export const getDaysBySchoolRepo = async (schoolId: number) => {
  return prisma.day.findMany({
    where: { schoolId, isActive: true },
    orderBy: { order: "asc" },
  });
};

export const getDayByIdRepo = async (dayId: number) => {
  return prisma.day.findUnique({
    where: { id: dayId },
    select: { maxPeriods: true },
  });
};
