// studentAttendance.service.ts

import StudentAttendanceRepository
from "./studentAttendance.repository.js";

export class StudentAttendanceService {

  private repo =
    StudentAttendanceRepository;

  // =====================================================
  // GET STUDENTS
  // =====================================================

  async getStudents(

    schoolId: number,

    classId: number,

    sectionId?: number
  ) {

    return this.repo
      .getStudents(

        schoolId,

        classId,

        sectionId
      );
  }

  // =====================================================
  // MARK ATTENDANCE
  // =====================================================

  // async markAttendance(
  //   payload: any,
  //   schoolId: number,
  //   markedById: number
  // ) {

  //   const {

  //     classId,

  //     sectionId,

  //     attendanceDate,

  //     records,

  //   } = payload;

  //   // =========================================
  //   // CHECK EXISTING
  //   // =========================================

  //   const existing =
  //     await this.repo
  //       .findSession(

  //         schoolId,

  //         classId,

  //         sectionId,

  //         new Date(
  //           attendanceDate
  //         )
  //       );

  //   if (existing) {

  //     throw new Error(
  //       "Attendance already marked"
  //     );
  //   }

  //   // =========================================
  //   // CREATE SESSION
  //   // =========================================

  //   const session =
  //     await this.repo
  //       .createSession({

  //         schoolId,

  //         classId,

  //         sectionId,

  //         markedById,

  //         attendanceDate:
  //           new Date(
  //             attendanceDate
  //           ),
  //       });

  //   // =========================================
  //   // CREATE RECORDS
  //   // =========================================

  //   const attendanceRecords =
  //     records.map(
  //       (item: any) => ({

  //         sessionId:
  //           session.id,

  //         studentId:
  //           item.studentId,

  //         status:
  //           item.status,

  //         remarks:
  //           item.remarks,
  //       })
  //     );

  //   await this.repo
  //     .createRecords(
  //       attendanceRecords
  //     );

  //   return {

  //     success: true,

  //     message:
  //       "Attendance marked successfully",
  //   };
  // }

  async markAttendance(
  payload: any,
  schoolId: number,
  markedById: number
) {

  const {
    classId,
    sectionId,
    attendanceDate,
    records,
  } = payload;

  console.log("========== MARK ATTENDANCE ==========");
  console.log("Payload:", payload);
  console.log("Records:", records);

  // =========================================
  // CHECK EXISTING
  // =========================================

  const existing = await this.repo.findSession(
    schoolId,
    classId,
    sectionId,
    new Date(attendanceDate)
  );

  if (existing) {
    throw new Error("Attendance already marked");
  }

  // =========================================
  // CREATE SESSION
  // =========================================

  const session = await this.repo.createSession({
    schoolId,
    classId,
    sectionId,
    markedById,
    attendanceDate: new Date(attendanceDate),
  });

  console.log("Session Created:", session);

  // =========================================
  // CREATE RECORDS
  // =========================================

  const attendanceRecords = records.map((item: any) => ({
    sessionId: session.id,
    studentId: item.studentId,
    status: item.status,
    remarks: item.remarks,
  }));

  console.log("Attendance Records:", attendanceRecords);

  const result = await this.repo.createRecords(attendanceRecords);

  console.log("CreateMany Result:", result);

  return {
    success: true,
    message: "Attendance marked successfully",
  };
}

  // =====================================================
  // DAILY ATTENDANCE
  // =====================================================

async getDailyAttendance(

  schoolId: number,

  attendanceDate: Date,

  classId?: number,

  sectionId?: number

) {

  return this.repo
    .getDailyAttendance(

      schoolId,

      attendanceDate,

      classId,

      sectionId
    );
}
  async updateAttendance(
  payload: any
) {

  const {
    recordId,
    status,
    remarks,
  } = payload;

  return this.repo
    .updateAttendance(

      recordId,

      {
        status,
        remarks,
      }
    );
}

// =====================================================
  // MONTHLY REPORT
  // =====================================================

async monthlyReport(

  schoolId: number,

  startDate: string,

  endDate: string,

  classId?: number,

  sectionId?: number

) {

  return this.repo
    .monthlyReport(

      schoolId,

      startDate,

      endDate,

      classId,

      sectionId
    );
}
  // =====================================================
  // STUDENT REPORT
  // =====================================================

  async studentReport(

    schoolId: number,

    studentId: number
  ) {

    return this.repo
      .studentReport(

        schoolId,

        studentId
      );
  }

  // =====================================================
  // CLASS REPORT
  // =====================================================

  async classReport(

    schoolId: number,

    classId: number
  ) {

    return this.repo
      .classReport(

        schoolId,

        classId
      );
  }

  // =====================================================
  // STATS
  // =====================================================

  // async stats(
  //   schoolId: number
  // ) {

  //   return this.repo
  //     .stats(schoolId);
  // }
  async stats(

  schoolId: number,

  startDate?: string,

  endDate?: string,

  classId?: number,

  sectionId?: number

) {

  return this.repo.stats(

    schoolId,

    startDate,

    endDate,

    classId,

    sectionId

  );

}

  // =====================================================
  // LOCK ATTENDANCE
  // =====================================================

  async lockAttendance(
    sessionId: number
  ) {

    return this.repo
      .lockAttendance(
        sessionId
      );
  }
}

export default
new StudentAttendanceService();