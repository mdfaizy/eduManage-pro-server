import repo
from "./studentFee.repository";

class StudentFeeService {

  // =====================================
  // GENERATE FEE
  // =====================================

  async generate(
    data: any
  ) {

    return repo.generate(
      data
    );
  }

  // =====================================
  // PAY FEE
  // =====================================

  async payFee(
    data: any
  ) {

    return repo.payFee(
      data
    );
  }

  // =====================================
  // GET ALL FEES
  // =====================================

  async getAll(
    schoolId: number
  ) {

    return repo.getAll(
      schoolId
    );
  }

  // =====================================
  // GET STUDENT HISTORY
  // =====================================

  async getStudentHistory(
    studentId: number
  ) {

    return repo
      .getStudentHistory(
        studentId
      );
  }

  // =====================================
  // GET DUE FEES
  // =====================================

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