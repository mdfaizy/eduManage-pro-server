import { createDayRepo, getDaysBySchoolRepo } from "./day.repository";

export const createDayService = async (body: any) => {
  const { schoolId, name, shortName, order, maxPeriods, isHalfDay } = body;

  if (!schoolId || !name) {
    throw new Error("schoolId and name are required");
  }

  return createDayRepo({
    schoolId,
    name,
    shortName,
    order,
    maxPeriods,
    isHalfDay: isHalfDay ?? false,
  });
};

export const getDaysBySchoolService = async (schoolId: number) => {
  return getDaysBySchoolRepo(schoolId);
};

