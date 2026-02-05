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
  capacity: number
) {
  if (!name) throw new Error("Section name required");
  if (!capacity || capacity <= 0)
    throw new Error("Section capacity must be greater than 0");

  const exists = await this.repo.exists(name, classId);
  if (exists) throw new Error("Section already exists");

  // ⭐ GET CLASS WITH SECTIONS
  const classData = await this.repo.getClassWithSections(classId);
  if (!classData) throw new Error("Class not found");

  if (!classData.maxStudents)
    throw new Error("Class capacity not set");

  // 🔥 CURRENT TOTAL SECTION CAPACITY
  const usedCapacity = classData.sections.reduce(
    (sum, sec) => sum + (sec.capacity || 0),
    0
  );

  const remaining = classData.maxStudents - usedCapacity;

  if (capacity > remaining) {
    throw new Error(
      `Only ${remaining} seats left in this class`
    );
  }

  return this.repo.create({ name, classId, schoolId, capacity });
}

  async getSections(classId?: number, schoolId?: number) {
    return this.repo.findSections(classId, schoolId);
  }
async getSectionById(id: number) {
  return this.repo.findById(id);
}
  async deleteSection(id: number) {
    return this.repo.delete(id);
  }
  async updateSection(id: number, data: any) {
  const allowedFields = ["name", "capacity", "isActive", "classTeacherId"];

  const updateData: any = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  return this.repo.update(id, updateData);
}

}
