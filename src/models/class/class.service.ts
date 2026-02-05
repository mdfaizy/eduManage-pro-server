import prisma from "../../config/prisma";
import { ClassRepository } from "./class.repository";
import { MasterSubjectRepository } from "../masterSubject/masterSubject.repository";

export class ClassService {
  private repo = new ClassRepository();
  private masterRepo = new MasterSubjectRepository();

  async createClass(name: string, schoolId: number, maxStudents: number, gradeId: number) {
    if (!name) throw new Error("Class name required");
    if (!gradeId) throw new Error("Grade required");

    const newClass = await this.repo.create({ name, schoolId, maxStudents, gradeId });

    const masters = await this.masterRepo.findByGrade(gradeId, schoolId);

    for (const sub of masters) {
      await prisma.subject.create({
        data: {
          name: sub.name,
          description: sub.description,
          code: `${sub.name.substring(0,3).toUpperCase()}-${newClass.id}-${Date.now().toString().slice(-3)}`,
          classId: newClass.id,
          schoolId
        }
      });
    }

    return newClass;
  }

  async getClasses(schoolId: number, gradeId?: number) {
    return this.repo.findAll(schoolId, gradeId);
  }

  async getClassById(id: number) {
    return this.repo.findById(id);
  }

  async updateClass(
    id: number,
    data: { name?: string; isActive?: boolean; maxStudents?: number; gradeId?: number }
  ) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Class not found");

    return prisma.$transaction(async (tx) => {

      const updatedClass = await tx.class.update({
        where: { id },
        data
      });

      // 🔥 Grade changed → Replace subjects
      if (data.gradeId && data.gradeId !== existing.gradeId) {

        // Delete old subjects
        // await tx.subject.deleteMany({ where: { classId: id } });

         await tx.subject.deleteMany({
    where: { classId: id, type: "CORE" }
  });

        // Get master subjects
        const masters = await tx.masterSubject.findMany({
          where: { gradeId: data.gradeId, schoolId: existing.schoolId }
        });

        // Add fresh subjects
        for (const sub of masters) {
  await tx.subject.upsert({
    where: {
      name_classId: {
        name: sub.name,
        classId: id
      }
    },
    update: {
      description: sub.description,
      code: `${sub.name.substring(0,3).toUpperCase()}-${id}-${Date.now().toString().slice(-3)}`,
      type: "CORE"
    },
    create: {
      name: sub.name,
      description: sub.description,
      code: `${sub.name.substring(0,3).toUpperCase()}-${id}-${Date.now().toString().slice(-3)}`,
      classId: id,
      schoolId: existing.schoolId,
      type: "CORE"
    }
  });
}

      }

      return updatedClass;
    });
  }

  async deleteClass(id: number) {
    return this.repo.delete(id);
  }
}
