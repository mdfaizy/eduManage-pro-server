// import prisma from "../../config/prisma";

// export class MasterSubjectRepository {

//   // ✅ FIXED
//   create(data: { name: string; description?: string; gradeId: number; schoolId: number }) {
//     return prisma.masterSubject.create({ data });
//   }

//   // ✅ FIXED
//   findByGrade(gradeId: number, schoolId: number) {
//     return prisma.masterSubject.findMany({
//       where: { 
//         gradeId: gradeId,   // 🔥 main fix
//         schoolId: schoolId 
//       },
//       orderBy: { name: "asc" }
//     });
//   }

//   findAll(schoolId: number) {
//     return prisma.masterSubject.findMany({
//       where: { schoolId },
//       orderBy: { gradeId: "asc" }
//     });
//   }

//   delete(id: number) {
//     return prisma.masterSubject.delete({ where: { id } });
//   }
// }
