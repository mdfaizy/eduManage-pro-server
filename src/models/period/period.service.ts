import { PeriodRepository } from "./period.repository";
import { getDayByIdRepo } from "../day/day.repository";

export class PeriodService {
  private repo = new PeriodRepository();

  /* =====================================================
     CREATE SINGLE PERIOD (PRODUCTION SAFE)
  ===================================================== */
  async createSingle(data: any) {
    const {
      schoolId,
      academicYearId,
      dayId,
      periodNumber,
      startTime,
      endTime,
      isBreak,
    } = data;

    // ✅ required validation
    if (!academicYearId || !dayId || !periodNumber || !startTime || !endTime) {
      throw new Error("Missing required period fields");
    }

    // 🔥 duplicate check
    const existing = await this.repo.findDuplicatePeriod(
      schoolId,
      academicYearId,
      dayId,
      periodNumber
    );

    if (existing) {
      throw new Error(
        `Period ${periodNumber} already exists for this day`
      );
    }

    // 🔥 get day maxPeriods
    const day = await getDayByIdRepo(dayId);

    if (!day) {
      throw new Error("Day not found");
    }

    // 🔥 count existing
    const currentCount = await this.repo.countByDay(
      schoolId,
      academicYearId,
      dayId
    );

    if (currentCount >= day.maxPeriods) {
      throw new Error(
        `Maximum periods (${day.maxPeriods}) reached for this day`
      );
    }

    // ✅ create
    return this.repo.create({
      schoolId,
      academicYearId,
      dayId,
      periodNumber,
      startTime,
      endTime,
      isBreak: isBreak || false,
    });
  }

  /* =====================================================
     BULK CREATE
  ===================================================== */
  async bulkCreate(data: any) {
    const { schoolId, academicYearId, periods } = data;

    if (!periods?.length) {
      throw new Error("No periods provided");
    }

    // ⚠️ full year reset (acceptable for setup phase)
    await this.repo.deleteBySchoolYear(schoolId, academicYearId);

    const formatted = periods.map((p: any) => ({
      schoolId,
      academicYearId,
      dayId: p.dayId,
      periodNumber: p.periodNumber,
      startTime: p.startTime,
      endTime: p.endTime,
      isBreak: p.isBreak || false,
    }));

    return this.repo.createMany(formatted);
  }

  /* =====================================================
     GET ALL
  ===================================================== */
  async getAll(schoolId: number, academicYearId: number) {
    return this.repo.findBySchool(schoolId, academicYearId);
  }

  /* =====================================================
     DELETE
  ===================================================== */
  async delete(id: number) {
    return this.repo.delete(id);
  }
}
