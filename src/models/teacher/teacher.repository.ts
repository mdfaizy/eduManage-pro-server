// src/models/teacher/teacher.repository.ts
import prisma from "../../config/prisma";

export class TeacherRepository {

   async findByUserId(userId: number) {
    return prisma.teacher.findUnique({
      where: { userId },
    });
  }

  // async create(data: { userId: number; schoolId: number }) {
  //   return prisma.teacher.create({
  //     data,
  //   });
  // }
  async create(data: {
    userId: number;
    schoolId: number;
    teacherCode: string;
    phone?: string;
    gender?: string;
    joiningDate?: Date;
    qualification?: string;
  }) {
    return prisma.teacher.create({ data });
  }


  // async findAllBySchool(schoolId: number) {
  //   return prisma.teacher.findMany({
  //     where: { schoolId },
  //     include: {
  //       user: {
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           isActive: true,
  //         },
  //       },
  //     },
  //     orderBy: { createdAt: "desc" },
  //   });
  // }


//   async findAllBySchool(schoolId: number) {
//   return prisma.teacher.findMany({
//     where: { schoolId },
//     select: {
//       id: true,
//       userId: true,
//       schoolId: true,
//       teacherCode: true, // 👈 ADD THIS
//       createdAt: true,
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           isActive: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// }

async findAllBySchool(schoolId: number) {
  return prisma.teacher.findMany({
    where: { schoolId },
    select: {
      id: true,
      userId: true,
      teacherCode: true,
      phone: true,
      gender: true,
      qualification: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

  
  // async create(data: { userId: number; schoolId: number }) {
  //   return prisma.teacher.create({ data });
  // }

  async findAll(schoolId: number) {
    return prisma.teacher.findMany({
      where: { schoolId },
      include: {
        user: { select: { name: true, email: true, isActive: true } },
      },
      orderBy: { id: "desc" },
    });
  }

  async findById(id: number) {
    return prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
  }
  updateTeacherProfile(
  teacherId: number,
  data: {
    phone?: string;
    gender?: string;
    qualification?: string;
    joiningDate?: Date;
  }
) {
  return prisma.teacher.update({
    where: { id: teacherId },
    data,
  });
}

}
