// =====================================================
// exam.service.ts
// =====================================================

import ExamRepository
from "./exam.repository.js";

export class ExamService {

  // =====================================================
  // CREATE
  // =====================================================

  async create(
    data: any
  ) {

    return ExamRepository
      .create(data);
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    schoolId: number
  ) {

    return ExamRepository
      .getAll(
        schoolId
      );
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(
    id: number,
    schoolId: number
  ) {

    return ExamRepository
      .getById(
        id,
        schoolId
      );
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {

    return ExamRepository
      .update(
        id,
        schoolId,
        data
      );
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    id: number,
    schoolId: number
  ) {

    return ExamRepository
      .delete(
        id,
        schoolId
      );
  }

  // =====================================================
  // ADD SUBJECT
  // =====================================================

  async addSubject(
    data: any
  ) {

    return ExamRepository
      .addSubject(data);
  }

  // =====================================================
  // ENTER MARKS
  // =====================================================

  async enterMarks(
    data: any
  ) {

    return ExamRepository
      .enterMarks(data);
  }
}

export default
new ExamService();