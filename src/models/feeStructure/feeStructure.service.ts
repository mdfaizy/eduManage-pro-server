import repo
from "./feeStructure.repository.js";

class FeeStructureService {

  async create(
    data: any
  ) {

    const totalFee =

      data.items.reduce(

        (
          sum: number,

          item: any
        ) =>

          sum + item.amount,

        0
      );

    return repo.create({

      ...data,

      totalFee,
    });
  }

  async getAll(
    schoolId: number
  ) {

    return repo.getAll(
      schoolId
    );
  }
}

export default
new FeeStructureService();