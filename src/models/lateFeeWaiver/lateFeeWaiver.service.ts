import repo from "./lateFeeWaiver.repository.js";

class LateFeeWaiverService {

  // ==========================================
  // CREATE
  // ==========================================

  async create(
    schoolId: number,
    studentFeeId: number,
    amount: number,
    reason: string,
    waivedBy: number
  ) {

    // ======================================
    // BASIC VALIDATION
    // ======================================

    if (
      !Number.isInteger(studentFeeId) ||
      studentFeeId <= 0
    ) {
      throw new Error(
        "Invalid student fee ID"
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Waiver amount must be greater than 0"
      );
    }

    if (
      !reason ||
      reason.trim().length < 3
    ) {
      throw new Error(
        "Waiver reason is required"
      );
    }

    // ======================================
    // GET STUDENT FEE
    // ======================================

    const studentFee =
      await repo.getStudentFee(
        studentFeeId,
        schoolId
      );

    if (!studentFee) {
      throw new Error(
        "Student fee not found"
      );
    }

    // ======================================
    // AVAILABLE LATE FEE
    // ======================================

    const lateFee =
      Number(studentFee.lateFee || 0);

    const alreadyWaived =
      Number(
        studentFee.lateFeeWaived || 0
      );

    const remainingLateFee =
      lateFee - alreadyWaived;

    if (remainingLateFee <= 0) {
      throw new Error(
        "No late fee is available for waiver"
      );
    }

    if (amount > remainingLateFee) {
      throw new Error(
        `Maximum waiver amount is ₹${remainingLateFee}`
      );
    }

    // ======================================
    // CREATE
    // ======================================

    return repo.create({
      schoolId,
      studentFeeId,
      amount,
      reason: reason.trim(),
      waivedBy,
    });
  }

  // ==========================================
  // GET ALL
  // ==========================================

  async getAll(
    schoolId: number
  ) {
    return repo.getAll(schoolId);
  }

  // ==========================================
  // GET BY STUDENT FEE
  // ==========================================

  async getByStudentFee(
    studentFeeId: number,
    schoolId: number
  ) {

    if (
      !Number.isInteger(studentFeeId) ||
      studentFeeId <= 0
    ) {
      throw new Error(
        "Invalid student fee ID"
      );
    }

    const studentFee =
      await repo.getStudentFee(
        studentFeeId,
        schoolId
      );

    if (!studentFee) {
      throw new Error(
        "Student fee not found"
      );
    }

    return repo.getByStudentFee(
      studentFeeId,
      schoolId
    );
  }
}

export default new LateFeeWaiverService();