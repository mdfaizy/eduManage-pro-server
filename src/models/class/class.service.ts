import { ClassRepository }
from "./class.repository";

export class ClassService {

  private repo =
    new ClassRepository();

  // =========================================
  // CREATE CLASS
  // =========================================

 async createClass(
  name: string,
  schoolId: number,
  maxStudents?: number,
  description?: string,
) {

  if (!name) {

    throw new Error(
      "Class name required"
    );
  }

  // =========================================
  // CHECK DUPLICATE
  // =========================================

  const existing =
    await this.repo.findByName(
      name,
      schoolId
    );

  if (existing) {

    throw new Error(
      "Class already exists"
    );
  }

  return this.repo.create({
    name,
    schoolId,
    maxStudents,
    description,
  });
}

  // =========================================
  // GET CLASSES
  // =========================================

  async getClasses(
    schoolId: number,
    activeOnly?: boolean
  ) {

    return this.repo.findAll(
      schoolId,
      activeOnly
    );
  }

  // =========================================
  // GET CLASS BY ID
  // =========================================

  async getClassById(
    id: number,
    schoolId: number
  ) {

    const existing =
      await this.repo.findById(
        id,
        schoolId
      );

    if (!existing) {

      throw new Error(
        "Class not found"
      );
    }

    return existing;
  }

  // =========================================
  // UPDATE CLASS
  // =========================================

  async updateClass(
    id: number,
    schoolId: number,
    data: {
      name?: string;
      description?: string;
      maxStudents?: number;
      isActive?: boolean;
    }
  ) {

    const existing =
      await this.repo.findById(
        id,
        schoolId
      );

    if (!existing) {

      throw new Error(
        "Class not found"
      );
    }

    return this.repo.update(
      id,
      schoolId,
      data
    );
  }

  // =========================================
  // DELETE CLASS
  // =========================================

  async deleteClass(
    id: number,
    schoolId: number
  ) {

    const existing =
      await this.repo.findById(
        id,
        schoolId
      );

    if (!existing) {

      throw new Error(
        "Class not found"
      );
    }

    return this.repo.delete(
      id,
      schoolId
    );
  }
}