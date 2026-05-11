// import prisma from "../../config/prisma.js";
// import { StudentRepository } from "./student.repository.js";
// import { generateStudentCode } from "../../utils/studentCode.utils.js";

// function toDate(value?: string | Date | null) {
//   if (!value) return null;
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return null;
//   return d;
// }
// export class StudentService {
//   private repo = new StudentRepository();
//   // =====================================================
//   // ✅ CREATE STUDENT (manual)
//   // =====================================================
 
//   // =====================================================
//   // ✅ CREATE FROM ADMISSION (🔥 IMPORTANT)
//   // =====================================================
//   async createFromAdmission(
//     tx: any,
//     admission: any,
//     schoolId: number
//   ) {
//     const studentCode = await generateStudentCode(tx, schoolId);

//     return this.repo.create(tx, {
//       name: admission.studentName,
//       schoolId,
//       studentCode,
//       dob: admission.dob,
//       gender: admission.gender,
//       address: admission.address,
//     });
//   }

//   // =====================================================
//   // ✅ LIST
//   // =====================================================
//   async getStudents(schoolId: number) {
//     return this.repo.findAll(schoolId);
//   }
// /* ===================================================== */
// /* 🔥 ENABLE STUDENT LOGIN (PRODUCTION) */
// /* ===================================================== */
// // async enableStudentLogin(
// //   studentId: number,
// //   email: string,
// //   schoolId: number
// // ) {
// //   return prisma.$transaction(async (tx) => {
// //     const student = await this.repo.findById(studentId, schoolId);
// //     if (!student) throw new Error("Student not found");

// //     if (student.userId) {
// //       throw new Error("Login already enabled for this student");
// //     }

// //     const normalizedEmail = email.toLowerCase().trim();

// //     // 🔍 check existing user
// //     let user = await tx.user.findUnique({
// //       where: { email: normalizedEmail },
// //     });

// //     const role = await tx.role.findFirst({
// //       where: { name: "STUDENT" },
// //     });

// //     if (!role) throw new Error("STUDENT role not found");

// //     // 🆕 create user if not exists
// //     if (!user) {
// //       const { UserService } = await import("../user/user.service.js");
// //       const userService = new UserService();

// //       user = await userService.inviteUser(
// //         {
// //           name: student.name,
// //           email: normalizedEmail,
// //           roleId: role.id,
// //         },
// //         schoolId
// //       );
// //     }

// //     // 🔥 prevent double link
// //     const alreadyLinked = await this.repo.findByUserId(user.id);
// //     if (alreadyLinked) {
// //       throw new Error("This email is already linked to another student");
// //     }

// //     // 🔗 link student → user
// //     await tx.student.update({
// //       where: { id: studentId },
// //       data: { userId: user.id },
// //     });

// //     return { message: "Student login enabled successfully" };
// //   });
// // }
//   // =====================================================
//   // ✅ GET SINGLE (ROLE SAFE)
//   // =====================================================
  
//   async enableStudentLogin(studentId: number, email: string, schoolId: number) {
//   return prisma.$transaction(async (tx) => {
//     const student = await tx.student.findFirst({
//       where: { id: studentId, schoolId },
//     });

//     if (!student) throw new Error("Student not found");

//     // ✅ already linked check
//     if (student.userId) {
//       throw new Error("Login already enabled for this student");
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     // ✅ email already used check
//     const existingUser = await tx.user.findUnique({
//       where: { email: normalizedEmail },
//     });

//     if (existingUser) {
//       throw new Error("This email is already in use");
//     }

//     // role
//     const role = await tx.role.findFirst({
//       where: { name: "STUDENT" },
//     });

//     if (!role) throw new Error("STUDENT role not found");

//     // create user via UserService
//     const { UserService } = await import("../user/user.service.js");
//     const userService = new UserService();

//     const user = await userService.inviteUser(
//       {
//         name: student.name,
//         email: normalizedEmail,
//         roleId: role.id,
//       },
//       schoolId
//     );

//     // link student
//     await tx.student.update({
//       where: { id: studentId },
//       data: { userId: user.id },
//     });

//     return { message: "Login enabled successfully" };
//   });
// }
//   async getStudent(id: number, user: any) {
//     const { userId, schoolId, roles } = user;

//     const isAdmin =
//       roles.includes("ADMIN") || roles.includes("SCHOOL_ADMIN");

//     const isTeacher = roles.includes("TEACHER");

//     // ✅ ADMIN / TEACHER
//     if (isAdmin || isTeacher) {
//       const student = await prisma.student.findFirst({
//         where: { id, schoolId, isDeleted: false },
//       });

//       if (!student) throw new Error("Student not found");
//       return student;
//     }

//     // ✅ PARENT
//     if (roles.includes("PARENT")) {
//       const parent = await prisma.parent.findUnique({
//         where: { userId },
//       });

//       const student = await prisma.student.findFirst({
//         where: {
//           id,
//           schoolId,
//           isDeleted: false,
//           parents: {
//             some: { parentId: parent?.id },
//           },
//         },
//       });

//       if (!student) throw new Error("Access denied");
//       return student;
//     }

//     throw new Error("Access denied");
//   }

//   // =====================================================
// // ✅ TOGGLE STUDENT STATUS
// // =====================================================
// async updateStudentStatus(
//   studentId: number,
//   isActive: boolean,
//   schoolId: number
// ) {
//   const student = await this.repo.findById(studentId, schoolId);

//   if (!student) {
//     throw new Error("Student not found");
//   }

//   // 🔒 optional business rule
//   if (!isActive && student.userId) {
//     // optionally disable user login also
//     await prisma.user.update({
//       where: { id: student.userId },
//       data: { isActive: false },
//     });
//   }

//   return this.repo.updateStatus(studentId, isActive);
// }

//   // =====================================================
//   // ✅ LINK PARENT
//   // =====================================================
//   async linkParent(
//     studentId: number,
//     parentEmail: string,
//     parentName: string,
//     schoolId: number
//   ) {
//     return prisma.$transaction(async (tx) => {
//       let user = await tx.user.findUnique({
//         where: { email: parentEmail.toLowerCase() },
//       });

//       const parentRole = await tx.role.findFirst({
//         where: { name: "PARENT" },
//       });

//       if (!parentRole) throw new Error("PARENT role not found");

//       // existing user
//       if (user) {
//         await tx.userRole.upsert({
//           where: {
//             userId_roleId: {
//               userId: user.id,
//               roleId: parentRole.id,
//             },
//           },
//           update: {},
//           create: {
//             userId: user.id,
//             roleId: parentRole.id,
//           },
//         });
//       } else {
//         const { UserService } = await import("../user/user.service.js");
//         const userService = new UserService();

//         user = await userService.inviteUser(
//           {
//             name: parentName,
//             email: parentEmail,
//             roleId: parentRole.id,
//           },
//           schoolId
//         );
//       }

//       // ensure parent profile
//       let parent = await tx.parent.findUnique({
//         where: { userId: user.id },
//       });

//       if (!parent) {
//         parent = await tx.parent.create({
//           data: { userId: user.id, schoolId },
//         });
//       }

//       // final link
//       await tx.studentParent.upsert({
//         where: {
//           studentId_parentId: {
//             studentId,
//             parentId: parent.id,
//           },
//         },
//         update: {},
//         create: {
//           studentId,
//           parentId: parent.id,
//         },
//       });

//       return { message: "Parent linked successfully" };
//     });
//   }

//   // =====================================================
//   // ✅ PARENT DASHBOARD
//   // =====================================================
//   async getMyChildren(userId: number, schoolId: number) {
//     const parent = await prisma.parent.findUnique({
//       where: { userId },
//     });

//     if (!parent) return [];

//     return prisma.student.findMany({
//       where: {
//         schoolId,
//         isDeleted: false,
//         parents: {
//           some: { parentId: parent.id },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });
//   }

//   // async updateStudent(id: number, payload: any) {
//   //   return this.repo.update(id, payload);
//   // }

// async updateStudent(
//   id: number,
//   payload: any,
//   schoolId: number
// ) {
//   const student = await this.repo.findById(id, schoolId);
//   if (!student) throw new Error("Student not found");

//   const allowedData: any = {};

//   if (payload.name !== undefined)
//     allowedData.name = payload.name;

//   if (payload.dob !== undefined) {
//     allowedData.dob = toDate(payload.dob); // ✅ FIX HERE
//   }

//   if (payload.gender !== undefined)
//     allowedData.gender = payload.gender;

//   if (payload.address !== undefined)
//     allowedData.address = payload.address;

//   return this.repo.update(id, allowedData);
// }

//   async toggleStatus(id: number, isActive: boolean) {
//     return this.repo.update(id, { isActive });
//   }

//   async deleteStudent(id: number) {
//     return this.repo.softDelete(id);
//   }
// }

// import { StudentRepository } from "./student.repository.js";

// export class StudentService {

//   private repo = new StudentRepository();

//   // async createFromAdmission(
//   //   tx: any,
//   //   admission: any,
//   //   schoolId: number
//   // ) {

//   //   const studentCode =
//   //     await this.generateStudentCode(tx, schoolId);

//   //   return this.repo.create(tx, {

//   //     schoolId,

//   //     name: admission.studentName,

//   //     studentCode,

//   //     dob: admission.dob,

//   //     gender: admission.gender,

//   //     address: admission.address,
//   //   });
//   // }
//   async createFromAdmission(
//   tx: any,
//   admission: any,
//   schoolId: number
// ) {

//   const studentCode =
//     await this.generateStudentCode(tx, schoolId);

//   return this.repo.create(tx, {

//     schoolId,

//     name: admission.studentName,

//     studentCode,

//     dob: admission.dob,

//     address: admission.address,
//   });
// }

//   async generateStudentCode(
//     tx: any,
//     schoolId: number
//   ) {

//     const count =
//       await tx.student.count({
//         where: { schoolId },
//       });

//     return `STU-${String(count + 1).padStart(5, "0")}`;
//   }
// }


// import prisma from "../../config/prisma.js";

// import { StudentRepository }
// from "./student.repository.js";

// export class StudentService {

//   private repo =
//     new StudentRepository();

//   // =====================================================
//   // CREATE FROM ADMISSION
//   // =====================================================

//   async createFromAdmission(
//     tx: any,
//     admission: any,
//     schoolId: number
//   ) {

//     const studentCode =
//       await this.generateStudentCode(
//         tx,
//         schoolId
//       );

//     return this.repo.create(tx, {

//       schoolId,

//       name:
//         admission.studentName,

//       studentCode,

//       dob: admission.dob,

//       address:
//         admission.address,
//     });
//   }

//   // =====================================================
//   // GENERATE CODE
//   // =====================================================

//   async generateStudentCode(
//     tx: any,
//     schoolId: number
//   ) {

//     const count =
//       await tx.student.count({

//         where: {
//           schoolId,
//         },
//       });

//     return `STU-${String(
//       count + 1
//     ).padStart(5, "0")}`;
//   }

//   // =====================================================
//   // LIST
//   // =====================================================

//   async getStudents(
//     schoolId: number
//   ) {

//     return this.repo.findAll(
//       schoolId
//     );
//   }

//   // =====================================================
//   // GET SINGLE
//   // =====================================================

//   // async getStudent(
//   //   id: number,
//   //   user: any
//   // ) {

//   //   const student =
//   //     await prisma.student.findFirst({

//   //       where: {

//   //         id,

//   //         schoolId:
//   //           user.schoolId,

//   //         isDeleted: false,
//   //       },
//   //     });

//   //   if (!student) {
//   //     throw new Error(
//   //       "Student not found"
//   //     );
//   //   }

//   //   return student;
//   // }

//   async getStudent(
//   id: number,
//   user: any
// ) {

//   const student =
//     await this.repo.findById(
//       id,
//       user.schoolId
//     );

//   if (!student) {

//     throw new Error(
//       "Student not found"
//     );
//   }

//   return student;
// }
//   // =====================================================
//   // ENABLE LOGIN
//   // =====================================================

//   async enableStudentLogin(
//     studentId: number,
//     email: string,
//     schoolId: number
//   ) {

//     return prisma.$transaction(
//       async (tx) => {

//         const student =
//           await this.repo.findById(
//             studentId,
//             schoolId
//           );

//         if (!student) {
//           throw new Error(
//             "Student not found"
//           );
//         }

//         if (student.userId) {
//           throw new Error(
//             "Login already enabled"
//           );
//         }

//         const existingUser =
//           await tx.user.findUnique({

//             where: {
//               email:
//                 email.toLowerCase(),
//             },
//           });

//         if (existingUser) {
//           throw new Error(
//             "Email already exists"
//           );
//         }

//         const role =
//           await tx.role.findFirst({

//             where: {
//               name: "STUDENT",
//             },
//           });

//         if (!role) {
//           throw new Error(
//             "STUDENT role not found"
//           );
//         }

//         const user =
//           await tx.user.create({

//             data: {

//               name:
//                 student.name,

//               email:
//                 email.toLowerCase(),

//               password:
//                 "123456",

//               schoolId,

//               isActive: true,
//             },
//           });

//         await tx.userRole.create({

//           data: {

//             userId: user.id,

//             roleId: role.id,
//           },
//         });

//         await tx.student.update({

//           where: {
//             id: studentId,
//           },

//           data: {
//             userId: user.id,
//           },
//         });

//         return {

//           message:
//             "Student login enabled",
//         };
//       }
//     );
//   }

//   // =====================================================
//   // LINK PARENT
//   // =====================================================

//   async linkParent(
//     studentId: number,
//     parentEmail: string,
//     parentName: string,
//     schoolId: number
//   ) {

//     return prisma.$transaction(
//       async (tx) => {

//         let user =
//           await tx.user.findUnique({

//             where: {
//               email:
//                 parentEmail.toLowerCase(),
//             },
//           });

//         const role =
//           await tx.role.findFirst({

//             where: {
//               name: "PARENT",
//             },
//           });

//         if (!role) {
//           throw new Error(
//             "PARENT role not found"
//           );
//         }

//         if (!user) {

//           user =
//             await tx.user.create({

//               data: {

//                 name: parentName,

//                 email:
//                   parentEmail.toLowerCase(),

//                 password:
//                   "123456",

//                 schoolId,

//                 isActive: true,
//               },
//             });

//           await tx.userRole.create({

//             data: {

//               userId: user.id,

//               roleId: role.id,
//             },
//           });
//         }

//         let parent =
//           await tx.parent.findFirst({

//             where: {
//               userId: user.id,
//             },
//           });

//         if (!parent) {

//           parent =
//             await tx.parent.create({

//               data: {

//                 userId: user.id,

//                 schoolId,
//               },
//             });
//         }

//         const existing =
//           await tx.studentParent.findUnique({

//             where: {

//               studentId_parentId: {

//                 studentId,

//                 parentId:
//                   parent.id,
//               },
//             },
//           });

//         if (existing) {
//           throw new Error(
//             "Parent already linked"
//           );
//         }

//         await tx.studentParent.create({

//           data: {

//             studentId,

//             parentId:
//               parent.id,
//           },
//         });

//         return {

//           message:
//             "Parent linked successfully",
//         };
//       }
//     );
//   }

//   // =====================================================
//   // UPDATE
//   // =====================================================

//   async updateStudent(
//     id: number,
//     payload: any,
//     schoolId: number
//   ) {

//     const student =
//       await this.repo.findById(
//         id,
//         schoolId
//       );

//     if (!student) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     return this.repo.update(
//       id,
//       payload
//     );
//   }

//   // =====================================================
//   // STATUS
//   // =====================================================

//   async updateStudentStatus(
//     studentId: number,
//     isActive: boolean,
//     schoolId: number
//   ) {

//     const student =
//       await this.repo.findById(
//         studentId,
//         schoolId
//       );

//     if (!student) {
//       throw new Error(
//         "Student not found"
//       );
//     }

//     return this.repo.updateStatus(
//       studentId,
//       isActive
//     );
//   }

//   // =====================================================
//   // DELETE
//   // =====================================================

//   async deleteStudent(id: number) {

//     return this.repo.softDelete(id);
//   }
// }


import prisma from "../../config/prisma.js";
import { UserRepository }
from "../user/user.repository.js";

import { RoleRepository }
from "../role/role.repository.js";
import { StudentRepository }
from "./student.repository.js";
import {
  hashPassword,
} from "../../utils/password.js";
export class StudentService {

  private repo =
    new StudentRepository();
private userRepo =
  new UserRepository();

private roleRepo =
  new RoleRepository();
  // =====================================================
  // CREATE FROM ADMISSION
  // =====================================================

  async createFromAdmission(
    tx: any,
    admission: any,
    schoolId: number
  ) {

    const studentCode =
      await this.generateStudentCode(
        tx,
        schoolId
      );

    return this.repo.create(tx, {

      schoolId,

      name:
        admission.studentName,

      studentCode,

      dob:
        admission.dob,

      gender:
        admission.gender,

      bloodGroup:
        admission.bloodGroup,

      nationality:
        admission.nationality,

      religion:
        admission.religion,

      caste:
        admission.caste,

      aadharNumber:
        admission.aadharNumber,

      address:
        admission.address,

      phoneNumber:
        admission.phoneNumber,

      email:
        admission.email,

      profilePhoto:
        admission.profilePhoto,
    });
  }

  // =====================================================
  // GENERATE STUDENT CODE
  // =====================================================

  async generateStudentCode(
    tx: any,
    schoolId: number
  ) {

    const count =
      await tx.student.count({

        where: {
          schoolId,
        },
      });

    return `STU-${String(
      count + 1
    ).padStart(5, "0")}`;
  }

  // =====================================================
  // GET ALL STUDENTS
  // =====================================================

  async getStudents(
    schoolId: number
  ) {

    return this.repo.findAll(
      schoolId
    );
  }

  // =====================================================
  // GET SINGLE STUDENT
  // =====================================================

  async getStudent(
    id: number,
    user: any
  ) {

    const student =
      await this.repo.findById(
        id,
        user.schoolId
      );

    if (!student) {

      throw new Error(
        "Student not found"
      );
    }

    return student;
  }

  // =====================================================
  // ENABLE STUDENT LOGIN
  // =====================================================

  async enableStudentLogin(
    studentId: number,
    email: string,
    schoolId: number
  ) {

    return prisma.$transaction(

      async (tx) => {

        /* =====================================
           STUDENT
        ===================================== */

        const student =
          await this.repo.findById(
            studentId,
            schoolId
          );

        if (!student) {

          throw new Error(
            "Student not found"
          );
        }

        if (student.userId) {

          throw new Error(
            "Login already enabled"
          );
        }

        /* =====================================
           EMAIL EXISTS
        ===================================== */

        const existingUser =
          await this.repo
            .findUserByEmail(
              tx,
              email
            );

        if (existingUser) {

          throw new Error(
            "Email already exists"
          );
        }

        /* =====================================
           ROLE
        ===================================== */

        const role =
          await this.repo
            .findRoleByName(
              tx,
              "STUDENT"
            );

        if (!role) {

          throw new Error(
            "STUDENT role not found"
          );
        }

        /* =====================================
           CREATE USER
        ===================================== */

        const user =
          await this.repo
            .createUser(
              tx,
              {

                name:
                  student.name,

                email:
                  email.toLowerCase(),

                password:
                  "123456",

                schoolId,

                isActive: true,

              }
            );

        /* =====================================
           ASSIGN ROLE
        ===================================== */

        await this.repo
          .createUserRole(
            tx,
            {

              userId:
                user.id,

              roleId:
                role.id,

            }
          );

        /* =====================================
           UPDATE STUDENT
        ===================================== */

        await this.repo.update(
          student.id,
          {

            userId:
              user.id,

            email:
              email.toLowerCase(),

          }
        );

        return {

          message:
            "Student login enabled",

        };
      }
    );
  }

  // =====================================================
  // LINK PARENT
  // =====================================================

 async enableParentLogin(

  parentId: number,

  email: string,

  schoolId: number

) {

  return prisma.$transaction(

    async (tx) => {

      /* =====================================
         EMAIL VALIDATION
      ===================================== */

      if (!email) {

        throw new Error(
          "Parent email is required"
        );
      }

      /* =====================================
         FIND PARENT
      ===================================== */

      const parent =
        await tx.parent.findFirst({

          where: {

            id: parentId,

            schoolId,

          },
        });

      if (!parent) {

        throw new Error(
          "Parent not found"
        );
      }

      /* =====================================
         ALREADY ENABLED
      ===================================== */

      if (parent.userId) {

        throw new Error(
          "Parent login already enabled"
        );
      }

      /* =====================================
         EXISTING USER
      ===================================== */

      const existingUser =
        await this.userRepo.findByEmail(

          email.toLowerCase()

        );

      if (existingUser) {

        throw new Error(
          "Email already exists"
        );
      }

      /* =====================================
         ROLE
      ===================================== */

      const role =
        await this.roleRepo.findByName(
          "PARENT",
          schoolId
        );

      if (!role) {

        throw new Error(
          "PARENT role not found"
        );
      }

      /* =====================================
         TEMP PASSWORD
      ===================================== */

      const tempPassword =

        Math.random()

          .toString(36)

          .slice(-8);

      const hashedPassword =
        await hashPassword(
          tempPassword
        );

      /* =====================================
         CREATE USER
      ===================================== */

      const user =
        await tx.user.create({

          data: {

            schoolId,

            name:

              parent.fatherName ||

              parent.guardianName ||

              "Parent",

            email:
              email.toLowerCase(),

            password:
              hashedPassword,

            isActive: true,

          },
        });

      /* =====================================
         ASSIGN ROLE
      ===================================== */

      await tx.userRole.create({

        data: {

          userId:
            user.id,

          roleId:
            role.id,

        },
      });

      /* =====================================
         UPDATE PARENT
      ===================================== */

      await tx.parent.update({

        where: {
          id: parent.id,
        },

        data: {

          userId:
            user.id,
        },
      });

      console.log({

        email,

        tempPassword,

      });

      /* =====================================
         RESPONSE
      ===================================== */

      return {

        success: true,

        message:
          "Parent login enabled",

        credentials: {

          email,

          password:
            tempPassword,

        },
      };
    }
  );
}

  // =====================================================
  // UPDATE STUDENT
  // =====================================================

  async updateStudent(
    id: number,
    payload: any,
    schoolId: number
  ) {

    const student =
      await this.repo.findById(
        id,
        schoolId
      );

    if (!student) {

      throw new Error(
        "Student not found"
      );
    }

    return this.repo.update(
      id,
      payload
    );
  }

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  async updateStudentStatus(
    studentId: number,
    isActive: boolean,
    schoolId: number
  ) {

    const student =
      await this.repo.findById(
        studentId,
        schoolId
      );

    if (!student) {

      throw new Error(
        "Student not found"
      );
    }

    return this.repo.updateStatus(
      studentId,
      isActive
    );
  }

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  async deleteStudent(
    id: number
  ) {

    return this.repo.softDelete(
      id
    );
  }
}