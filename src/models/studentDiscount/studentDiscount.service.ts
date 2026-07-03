import repo from "./studentDiscount.repository.js";

class StudentDiscountService {

  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {

    // Duplicate Check
    const existing = await repo.findExisting(
      data.studentId,
      data.feeHeadId,
      data.applyType
    );

    if (existing) {
      throw new Error(
        "Discount already exists for this fee head."
      );
    }

    // Percentage Validation
    if (
      data.type === "PERCENTAGE" &&
      (Number(data.amount) <= 0 ||
        Number(data.amount) > 100)
    ) {
      throw new Error(
        "Percentage discount must be between 1 and 100."
      );
    }

    // Monthly Validation
    if (data.applyType === "MONTHLY") {

      if (
        !data.startMonth ||
        !data.endMonth
      ) {
        throw new Error(
          "Start month and End month are required."
        );
      }

      if (
        data.startMonth >
        data.endMonth
      ) {
        throw new Error(
          "Start month cannot be greater than End month."
        );
      }

    }

    return repo.create(data);

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
        "Discount not found."
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
        "Discount not found."
      );

    }

    if (
      data.type === "PERCENTAGE" &&
      Number(data.amount) > 100
    ) {

      throw new Error(
        "Percentage cannot exceed 100."
      );

    }

    return repo.update(
      id,
      schoolId,
      data
    );

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
        "Discount not found."
      );

    }

    return repo.delete(
      id,
      schoolId
    );

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
        "Discount not found."
      );

    }

    return repo.toggle(
      id,
      schoolId,
      isActive
    );

  }

}

export default new StudentDiscountService();