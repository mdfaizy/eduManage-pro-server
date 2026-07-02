// import repo
// from "./feeStructure.repository.js";

// class FeeStructureService {

//   async create(
//     data: any
//   ) {

//     const totalFee =

//       data.items.reduce(

//         (
//           sum: number,

//           item: any
//         ) =>

//           sum + item.amount,

//         0
//       );

//     return repo.create({

//       ...data,

//       totalFee,
//     });
//   }

//   async getAll(
//     schoolId: number
//   ) {

//     return repo.getAll(
//       schoolId
//     );
//   }
// }

// export default
// new FeeStructureService();


// import repo
// from "./feeStructure.repository.js";

// class FeeStructureService {

//   // async create(
//   //   data: any
//   // ) {

//   //   return repo.create(data);
//   // }

//   async create(
//   data: any
// ) {

//   const totalFee =

//     data.items.reduce(

//       (
//         sum: number,

//         item: any
//       ) =>

//         sum + Number(item.amount),

//       0
//     );

//   return repo.create({

//     ...data,

//     totalFee,
//   });
// }

//   async getAll(
//     schoolId: number
//   ) {

//     return repo.getAll(
//       schoolId
//     );
//   }

//   async update(
//     id: number,
//     data: any
//   ) {

//     return repo.update(
//       id,
//       data
//     );
//   }

//   async delete(
//     id: number
//   ) {

//     return repo.delete(id);
//   }

//   // =====================================
//   // GET ONE
//   // =====================================

//   async getOne(
//     id: number
//   ) {

//     return repo.getOne(
//       id
//     );
//   }

//   async toggle(
//     id: number,
//     isActive: boolean
//   ) {

//     return repo.toggle(
//       id,
//       isActive
//     );
//   }
// }

// export default
// new FeeStructureService();

import repo
from "./feeStructure.repository.js";

class FeeStructureService {

  // =====================================
  // CREATE
  // =====================================

  async create(
    data: any
  ) {

    const items =
      data.items || [];

    // =====================================
    // DUPLICATE FEE HEAD CHECK
    // =====================================

    const feeHeadIds =
      items.map(
        (item: any) =>
          item.feeHeadId
      );

    const uniqueIds =
      new Set(feeHeadIds);

    if (
      feeHeadIds.length !==
      uniqueIds.size
    ) {

      throw new Error(
        "Duplicate fee heads are not allowed"
      );
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

    const feeStructure =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeStructure) {

      throw new Error(
        "Fee structure not found"
      );
    }

    return feeStructure;
  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {

    const feeStructure =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeStructure) {

      throw new Error(
        "Fee structure not found"
      );
    }

    const items =
      data.items || [];

    // =====================================
    // DUPLICATE FEE HEAD CHECK
    // =====================================

    const feeHeadIds =
      items.map(
        (item: any) =>
          item.feeHeadId
      );

    const uniqueIds =
      new Set(feeHeadIds);

    if (
      feeHeadIds.length !==
      uniqueIds.size
    ) {

      throw new Error(
        "Duplicate fee heads are not allowed"
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

    const feeStructure =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeStructure) {

      throw new Error(
        "Fee structure not found"
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

    const feeStructure =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeStructure) {

      throw new Error(
        "Fee structure not found"
      );
    }

    return repo.toggle(
      id,
      schoolId,
      isActive
    );
  }
}

export default
new FeeStructureService();