import repo
from "./feeHead.repository";

class FeeHeadService {

  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {

    const existing =

      await repo
        .findByName(

          data.schoolId,

          data.name
        );

    if (existing) {

      throw new Error(
        "Fee head already exists"
      );
    }

    return repo.create(
      data
    );
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
}

export default
new FeeHeadService();