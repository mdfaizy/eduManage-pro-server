import repo from "./studentScholarship.repository.js";

class StudentScholarshipService {
  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {
    // ==============================
    // DUPLICATE CHECK
    // ==============================

    const existing =
      await repo.findByStudentAndScholarship(
        data.studentId,
        data.scholarshipId,
        data.schoolId
      );

    if (existing) {
      throw new Error(
        "Scholarship already assigned to this student"
      );
    }

    // ==============================
    // CREATE
    // ==============================

    const result =
      await repo.create(data);

    return result;
  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    schoolId: number
  ) {
    return repo.getAll(
      schoolId
    );
  }

  // =====================================
  // GET ONE
  // =====================================

  async getOne(
    id: number,
    schoolId: number
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Student scholarship not found"
      );
    }

    return record;
  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Student scholarship not found"
      );
    }

    const result =
      await repo.update(
        id,
        schoolId,
        data
      );

    return result;
  }

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number,
    schoolId: number
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Student scholarship not found"
      );
    }

    const result =
      await repo.delete(
        id,
        schoolId
      );

    return result;
  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    id: number,
    schoolId: number,
    isActive: boolean
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Student scholarship not found"
      );
    }

    const result =
      await repo.toggle(
        id,
        schoolId,
        isActive
      );

    return result;
  }
}

export default new StudentScholarshipService();