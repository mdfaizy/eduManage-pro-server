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