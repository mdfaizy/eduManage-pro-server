import repo from "./feeHead.repository";
import {
  CreateFeeHeadDTO,
  UpdateFeeHeadDTO
} from "./feeHead.types.js";
class FeeHeadService {

  // =====================================================
  // CREATE
  // =====================================================

  async create(data: CreateFeeHeadDTO) {

    const existing =
      await repo.findByName(
        data.schoolId,
        data.name
      );

    if (existing) {

      throw new Error(
        "Fee head already exists"
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

    const feeHead =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeHead) {

      throw new Error(
        "Fee head not found"
      );
    }

    return feeHead;
  }

  // =====================================================
  // UPDATE
  // =====================================================

 async update(
   id: number,
    schoolId: number,
    data: UpdateFeeHeadDTO
) {

  const feeHead =
    await repo.getOne(
      id,
      schoolId
    );

  if (!feeHead) {
    throw new Error(
      "Fee head not found"
    );
  }

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
        "Fee head already exists"
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

    const feeHead =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeHead) {

      throw new Error(
        "Fee head not found"
      );
    }

    return repo.delete(id);
  }

  // =====================================================
  // TOGGLE
  // =====================================================

  async toggle(
    id: number,
    schoolId: number
  ) {

    const feeHead =
      await repo.getOne(
        id,
        schoolId
      );

    if (!feeHead) {

      throw new Error(
        "Fee head not found"
      );
    }

    return repo.toggle(
      id,
      schoolId,
      !feeHead.isActive
    );
  }
}

export default new FeeHeadService();