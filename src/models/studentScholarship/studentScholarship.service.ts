import repo from "./studentScholarship.repository.js";
import {
  recalculatePendingFees,
} from "../../utils/recalculatePendingFees.js";

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
        data.scholarshipId
      );

    if (existing) {
      throw new Error(
        "Scholarship already assigned to this student"
      );
    }

    const result =
      await repo.create(data);

    // ==============================
    // RECALCULATE FEES
    // ==============================

    // await recalculatePendingFees(
    //   data.studentId
    // );


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

    // await recalculatePendingFees(
    //   record.studentId
    // );

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

    // await recalculatePendingFees(
    //   record.studentId
    // );

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

    // await recalculatePendingFees(
    //   record.studentId
    // );

    return result;
  }
}

export default new StudentScholarshipService();