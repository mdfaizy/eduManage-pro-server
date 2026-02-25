import { AdmissionRepository } from "./admission.repository.js";

export class AdmissionService {
  private repo = new AdmissionRepository();

  // ✅ take admission
  async createAdmission(payload: any, schoolId: number) {
    if (!payload.studentId) throw new Error("studentId required");

    const existing = await this.repo.findActive(
      payload.studentId,
      payload.academicYear
    );

    if (existing) {
      throw new Error("Student already admitted for this academic year");
    }

    return this.repo.create({
      studentId: payload.studentId,
      schoolId,
      classId: payload.classId,
      sectionId: payload.sectionId ?? null,
      rollNumber: payload.rollNumber,
      admissionNo: payload.admissionNo,
      academicYear: payload.academicYear,
      status: "ACTIVE",
    });
  }

  async getStudentAdmissions(studentId: number) {
    return this.repo.findByStudent(studentId);
  }
}