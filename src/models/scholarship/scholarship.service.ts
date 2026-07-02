// import repo
// from "./scholarship.repository.js";

// class ScholarshipService {

//   async create(
//     data: any
//   ) {

//     return repo.create(
//       data
//     );
//   }

//   async getAll(
//     schoolId: number
//   ) {

//     return repo.getAll(
//       schoolId
//     );
//   }

//   async getOne(
//     id: number
//   ) {

//     return repo.getOne(
//       id
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

//     return repo.delete(
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
// new ScholarshipService();


import repo from "./scholarship.repository.js";

class ScholarshipService {

  // =====================================================
  // CREATE
  // =====================================================

  async create(data: any) {

    // =====================================
    // DUPLICATE CHECK
    // =====================================

    const existing =
      await repo.findByName(
        data.schoolId,
        data.name
      );

    if (existing) {
      throw new Error(
        "Scholarship already exists"
      );
    }

    return repo.create(data);
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    schoolId: number
  ) {

    return repo.getAll(
      schoolId
    );
  }

  // =====================================================
  // GET ONE
  // =====================================================

  async getOne(
    id: number,
    schoolId: number
  ) {

    const scholarship =
      await repo.getOne(
        id,
        schoolId
      );

    if (!scholarship) {
      throw new Error(
        "Scholarship not found"
      );
    }

    return scholarship;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {

    const scholarship =
      await repo.getOne(
        id,
        schoolId
      );

    if (!scholarship) {
      throw new Error(
        "Scholarship not found"
      );
    }

    // =====================================
    // DUPLICATE NAME CHECK
    // =====================================

    if (data.name) {

      const existing =
        await repo.findByName(
          schoolId,
          data.name
        );

      if (
        existing &&
        existing.id !== id
      ) {
        throw new Error(
          "Scholarship already exists"
        );
      }
    }

    return repo.update(
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

    const scholarship =
      await repo.getOne(
        id,
        schoolId
      );

    if (!scholarship) {
      throw new Error(
        "Scholarship not found"
      );
    }

    // =====================================
    // TODO
    // Check Student Scholarship Mapping
    // Before Delete
    // =====================================

    return repo.delete(
      id,
      schoolId
    );
  }

  // =====================================================
  // TOGGLE
  // =====================================================

  async toggle(
    id: number,
    schoolId: number
  ) {

    const scholarship =
      await repo.getOne(
        id,
        schoolId
      );

    if (!scholarship) {
      throw new Error(
        "Scholarship not found"
      );
    }

    return repo.toggle(
      id,
      schoolId,
      !scholarship.isActive
    );
  }

  // =====================================================
  // DROPDOWN
  // =====================================================

  async dropdown(
    schoolId: number
  ) {

    return repo.dropdown(
      schoolId
    );
  }
}

export default new ScholarshipService();