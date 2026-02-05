import prisma from "../../config/prisma";
import { TimetableRepository } from "./timetable.repository";

export class TimetableService {
  private repo = new TimetableRepository();

  async createEntry(data: {
    schoolId: number;
    classId: number;
    sectionId: number;
    subjectId: number;
    teacherId: number;
    day: string;
    period: number;
  }) {
    const { teacherId, subjectId, classId, sectionId, day, period } = data;

    // 1️⃣ Teacher teaches that subject?
    const mapping = await prisma.teacherSubject.findFirst({
      where: { teacherId, subjectId, classId },
    });
    if (!mapping) throw new Error("Teacher not assigned to this subject");

    // 2️⃣ Teacher free?
    const teacherBusy = await this.repo.teacherBusy(teacherId, day, period);
    if (teacherBusy) throw new Error("Teacher already assigned in this period");

    // 3️⃣ Section free?
    const sectionBusy = await this.repo.sectionBusy(sectionId, day, period);
    if (sectionBusy) throw new Error("Section already has a class in this period");

    return this.repo.create(data);
  }

  async getSectionTimetable(sectionId: number) {
    return this.repo.getBySection(sectionId);
  }
}
