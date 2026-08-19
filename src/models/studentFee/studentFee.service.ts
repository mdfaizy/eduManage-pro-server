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
  schoolId: number,
  studentId: number
) {
  return repo.getStudentHistory(
    schoolId,
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
// =====================================
// GENERATE WITH TRANSACTION
// =====================================

async generateWithTransaction(
  tx: any,
  data: any
) {
console.log("StudentFeeService.generateWithTransaction()");
  return repo
    .generateWithTransaction(
      tx,
      data
    );
}
  
}

export default
new StudentFeeService();