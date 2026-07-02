import repo
from "./transportRoute.repository.js";

class TransportRouteService {

  // =====================================
  // CREATE
  // =====================================

  async create(
    data: any
  ) {

    const existing =
      await repo.findByName(

        data.schoolId,

        data.name
      );

    if (existing) {

      throw new Error(
        "Route already exists"
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
    id: number
  ) {

    return repo.getOne(id);
  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    data: any
  ) {

    return repo.update(
      id,
      data
    );
  }

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number
  ) {

    return repo.delete(id);
  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    id: number,
    isActive: boolean
  ) {

    return repo.toggle(
      id,
      isActive
    );
  }
}

export default
new TransportRouteService();