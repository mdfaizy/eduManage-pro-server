import { AcademicYearRepository } from "./academicYear.repository";

export class AcademicYearService {
  private repo = new AcademicYearRepository();

  // ✅ CREATE
  async create(data: any) {
    if (!data.startDate || !data.endDate) {
      throw new Error("startDate and endDate are required");
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) {
      throw new Error("Start date must be before end date");
    }

    return this.repo.create({
      ...data,
      startDate: start, // 🔥 FIX
      endDate: end,     // 🔥 FIX
    });
  }

  // ✅ GET ALL
  async getAll(schoolId: number) {
    return this.repo.findAll(schoolId);
  }

  // ✅ GET BY ID (NEW)
  async getById(id: number) {
    const year = await this.repo.findById(id);
    if (!year) throw new Error("Academic year not found");
    return year;
  }

  // ✅ SET ACTIVE (toggle safe)
  async setActive(id: number, schoolId: number) {
    const year = await this.repo.findById(id);
    if (!year) throw new Error("Academic year not found");

    return this.repo.setActive(id, schoolId);
  }

  // ✅ PUT (full update)
  async update(id: number, data: any) {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (start >= end) {
        throw new Error("Start date must be before end date");
      }

      data.startDate = start;
      data.endDate = end;
    }

    return this.repo.update(id, data);
  }

  // ✅ PATCH (partial update)
  async patch(id: number, data: any) {
    return this.repo.update(id, data);
  }

  // ✅ DELETE
  async delete(id: number) {
    return this.repo.delete(id);
  }

  // ✅ GET ACTIVE
  async getActive(schoolId: number) {
    const year = await this.repo.getActive(schoolId);
    if (!year) throw new Error("No active academic year set");
    return year;
  }
}
