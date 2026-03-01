import prisma from "../../config/prisma.js";
import { StudentRepository } from "./student.repository.js";
import { generateStudentCode } from "../../utils/studentCode.utils.js";

function toDate(value?: string | Date | null) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

export class StudentService {
  private repo = new StudentRepository();

  // =====================================================
  // ✅ CREATE STUDENT (manual)
  // =====================================================
  async createStudent(payload: any, schoolId: number) {
    return prisma.$transaction(async (tx) => {
      const studentCode = await generateStudentCode(tx, schoolId);

      let userId: number | null = null;

      // ⭐ optional invite
      if (payload.email) {
        const { UserService } = await import("../user/user.service.js");
        const userService = new UserService();

        const role = await tx.role.findFirst({
          where: { name: "STUDENT" },
        });

        const user = await userService.inviteUser(
          {
            name: payload.name,
            email: payload.email,
            roleId: role!.id,
          },
          schoolId
        );

        userId = user.id;
      }

      return this.repo.create(tx, {
        name: payload.name,
        schoolId,
        studentCode,
        dob: toDate(payload.dob),
        gender: payload.gender,
        address: payload.address,
        userId,
      });
    });
  }

  // =====================================================
  // ✅ CREATE FROM ADMISSION (🔥 IMPORTANT)
  // =====================================================
  async createFromAdmission(
    tx: any,
    admission: any,
    schoolId: number
  ) {
    const studentCode = await generateStudentCode(tx, schoolId);

    return this.repo.create(tx, {
      name: admission.studentName,
      schoolId,
      studentCode,
      dob: admission.dob,
      gender: admission.gender,
      address: admission.address,
    });
  }

  // =====================================================
  // ✅ LIST
  // =====================================================
  async getStudents(schoolId: number) {
    return this.repo.findAll(schoolId);
  }

  // =====================================================
  // ✅ GET SINGLE (ROLE SAFE)
  // =====================================================
  async getStudent(id: number, user: any) {
    const { userId, schoolId, roles } = user;

    const isAdmin =
      roles.includes("ADMIN") || roles.includes("SCHOOL_ADMIN");

    const isTeacher = roles.includes("TEACHER");

    // ✅ ADMIN / TEACHER
    if (isAdmin || isTeacher) {
      const student = await prisma.student.findFirst({
        where: { id, schoolId, isDeleted: false },
      });

      if (!student) throw new Error("Student not found");
      return student;
    }

    // ✅ PARENT
    if (roles.includes("PARENT")) {
      const parent = await prisma.parent.findUnique({
        where: { userId },
      });

      const student = await prisma.student.findFirst({
        where: {
          id,
          schoolId,
          isDeleted: false,
          parents: {
            some: { parentId: parent?.id },
          },
        },
      });

      if (!student) throw new Error("Access denied");
      return student;
    }

    throw new Error("Access denied");
  }

  // =====================================================
  // ✅ LINK PARENT
  // =====================================================
  async linkParent(
    studentId: number,
    parentEmail: string,
    parentName: string,
    schoolId: number
  ) {
    return prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { email: parentEmail.toLowerCase() },
      });

      const parentRole = await tx.role.findFirst({
        where: { name: "PARENT" },
      });

      if (!parentRole) throw new Error("PARENT role not found");

      // existing user
      if (user) {
        await tx.userRole.upsert({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: parentRole.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            roleId: parentRole.id,
          },
        });
      } else {
        const { UserService } = await import("../user/user.service.js");
        const userService = new UserService();

        user = await userService.inviteUser(
          {
            name: parentName,
            email: parentEmail,
            roleId: parentRole.id,
          },
          schoolId
        );
      }

      // ensure parent profile
      let parent = await tx.parent.findUnique({
        where: { userId: user.id },
      });

      if (!parent) {
        parent = await tx.parent.create({
          data: { userId: user.id, schoolId },
        });
      }

      // final link
      await tx.studentParent.upsert({
        where: {
          studentId_parentId: {
            studentId,
            parentId: parent.id,
          },
        },
        update: {},
        create: {
          studentId,
          parentId: parent.id,
        },
      });

      return { message: "Parent linked successfully" };
    });
  }

  // =====================================================
  // ✅ PARENT DASHBOARD
  // =====================================================
  async getMyChildren(userId: number, schoolId: number) {
    const parent = await prisma.parent.findUnique({
      where: { userId },
    });

    if (!parent) return [];

    return prisma.student.findMany({
      where: {
        schoolId,
        isDeleted: false,
        parents: {
          some: { parentId: parent.id },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStudent(id: number, payload: any) {
    return this.repo.update(id, payload);
  }

  async toggleStatus(id: number, isActive: boolean) {
    return this.repo.update(id, { isActive });
  }

  async deleteStudent(id: number) {
    return this.repo.softDelete(id);
  }
}