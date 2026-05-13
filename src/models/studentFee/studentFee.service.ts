// =====================================================
// studentFee.service.ts
// =====================================================

import repo
from "./studentFee.repository";

class StudentFeeService {

  async generate(
    data: any
  ) {

    return repo.generate(
      data
    );
  }

  async payFee(
    data: any
  ) {

    return repo.payFee(
      data
    );
  }

  async getAll(
    schoolId: number
  ) {

    return repo.getAll(
      schoolId
    );
  }

  async getStudentHistory(
    studentId: number
  ) {

    return repo
      .getStudentHistory(
        studentId
      );
  }

  async getDueFees(
    schoolId: number
  ) {

    return repo
      .getDueFees(
        schoolId
      );
  }
}

export default
new StudentFeeService();