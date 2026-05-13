import { SectionRepository } from "./section.repository";
export class SectionService {
private repo = new SectionRepository();
// async createSection(name: string, classId: number, schoolId: number, capacity?: number) {
//   if (!name) throw new Error("Section name required");
//   if (!classId) throw new Error("Class required");
//   const exists = await this.repo.exists(name, classId);
//   if (exists) throw new Error("Section already exists in this class");
//   return this.repo.create({ name, classId, schoolId, capacity });
// }

async createSection(
  name: string,
  classId: number,
  schoolId: number,
  capacity?: number
) {

  if (!name) {
    throw new Error(
      "Section name required"
    );
  }

  // OPTIONAL CAPACITY

  if (
    capacity !== undefined &&
    capacity <= 0
  ) {

    throw new Error(
      "Section capacity must be greater than 0"
    );
  }

  const exists =
    await this.repo.exists(
      name,
      classId,
      schoolId
    );

  if (exists) {

    throw new Error(
      "Section already exists"
    );
  }

  // GET CLASS

  const classData =
    await this.repo.getClassWithSections(
      classId
    );

  if (!classData) {

    throw new Error(
      "Class not found"
    );
  }

  // CHECK CLASS LIMIT

  if (
    capacity !== undefined &&
    classData.maxStudents
  ) {

    const usedCapacity =
      classData.sections.reduce(
        (sum, sec) =>
          sum +
          (sec.capacity || 0),
        0
      );

    const remaining =
      classData.maxStudents -
      usedCapacity;

    if (
      capacity > remaining
    ) {

      throw new Error(
        `Only ${remaining} seats left in this class`
      );
    }
  }

  // CREATE

  return this.repo.create({

    name,

    classId,

    schoolId,

    ...(capacity !== undefined && {
      capacity,
    }),
  });
}
async toggleStatus(
  id: number,
  schoolId: number,
  isActive: boolean
) {

  const existing =
    await this.repo.findById(
      id,
      schoolId
    );

  if (!existing) {

    throw new Error(
      "Section not found"
    );
  }

  return this.repo.update(
    id,
    schoolId,
    {
      isActive,
    }
  );
}

  async getSections(classId?: number, schoolId?: number) {
    return this.repo.findSections(classId, schoolId);
  }
async getSectionById(id: number,schoolId:number) {
  return this.repo.findById(id,schoolId);
}
 async deleteSection(
  id: number,
  schoolId: number
) {

  return this.repo.delete(
    id,
    schoolId
  );
}
//   async updateSection(id: number, data: any) {
//   const allowedFields = ["name", "capacity", "isActive", "classTeacherId"];

//   const updateData: any = {};
//   for (const key of allowedFields) {
//     if (data[key] !== undefined) updateData[key] = data[key];
//   }

//   return this.repo.update(id, updateData);
// }

async updateSection(
  id: number,
  schoolId: number,
  data: any
) {

  // =====================================
  // CHECK EXISTING
  // =====================================

  const existing =
    await this.repo.findById(
      id,
      schoolId
    );

  if (!existing) {

    throw new Error(
      "Section not found"
    );
  }

  // =====================================
  // ALLOWED FIELDS
  // =====================================

  const allowedFields = [
    "name",
    "capacity",
    "isActive",
    "classTeacherId",
  ];

  const updateData: any = {};

  for (const key of allowedFields) {

    if (
      data[key] !== undefined
    ) {

      updateData[key] =
        data[key];
    }
  }

  // =====================================
  // CAPACITY VALIDATION
  // =====================================

  if (
    updateData.capacity !== undefined
  ) {

    const capacity =
      Number(
        updateData.capacity
      );

    if (capacity <= 0) {

      throw new Error(
        "Capacity must be greater than 0"
      );
    }

    // ===================================
    // CHECK CLASS LIMIT
    // ===================================

    const classData =
      await this.repo
        .getClassWithSections(
          existing.classId
        );

    if (
      classData?.maxStudents
    ) {

      const usedCapacity =
        classData.sections
          .filter(
            (sec) =>
              sec.id !== id
          )
          .reduce(
            (sum, sec) =>
              sum +
              (sec.capacity || 0),
            0
          );

      const remaining =
        classData.maxStudents -
        usedCapacity;

      if (
        capacity > remaining
      ) {

        throw new Error(
          `Only ${remaining} seats left in this class`
        );
      }
    }

    updateData.capacity =
      capacity;
  }

  // =====================================
  // UPDATE
  // =====================================

  return this.repo.update(
    id,
    schoolId,
    updateData
  );
}

async getSectionsByClass(
  classId: number,
  schoolId: number
) {

  const classData =
    await this.repo.getClassWithSections(
      classId,
    );

  if (!classData) {
    throw new Error(
      "Class not found"
    );
  }

  return classData.sections || [];
}



}
