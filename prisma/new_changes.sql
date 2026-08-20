-- DropForeignKey
ALTER TABLE `academicyear` DROP FOREIGN KEY `AcademicYear_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `admission` DROP FOREIGN KEY `Admission_academicYearId_fkey`;

-- DropForeignKey
ALTER TABLE `admission` DROP FOREIGN KEY `Admission_classId_fkey`;

-- DropForeignKey
ALTER TABLE `admission` DROP FOREIGN KEY `Admission_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `admission` DROP FOREIGN KEY `Admission_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `admission` DROP FOREIGN KEY `Admission_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `bookpackage` DROP FOREIGN KEY `BookPackage_classId_fkey`;

-- DropForeignKey
ALTER TABLE `bookpackage` DROP FOREIGN KEY `BookPackage_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `classteacher` DROP FOREIGN KEY `ClassTeacher_classId_fkey`;

-- DropForeignKey
ALTER TABLE `classteacher` DROP FOREIGN KEY `ClassTeacher_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `classteacher` DROP FOREIGN KEY `ClassTeacher_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `day` DROP FOREIGN KEY `Day_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `employeeattendance` DROP FOREIGN KEY `EmployeeAttendance_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employeeattendance` DROP FOREIGN KEY `EmployeeAttendance_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_academicYearId_fkey`;

-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_classId_fkey`;

-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `exammark` DROP FOREIGN KEY `ExamMark_examSubjectId_fkey`;

-- DropForeignKey
ALTER TABLE `exammark` DROP FOREIGN KEY `ExamMark_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `examsubject` DROP FOREIGN KEY `ExamSubject_examId_fkey`;

-- DropForeignKey
ALTER TABLE `examsubject` DROP FOREIGN KEY `ExamSubject_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `feehead` DROP FOREIGN KEY `FeeHead_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `feestructure` DROP FOREIGN KEY `FeeStructure_academicYearId_fkey`;

-- DropForeignKey
ALTER TABLE `feestructure` DROP FOREIGN KEY `FeeStructure_classId_fkey`;

-- DropForeignKey
ALTER TABLE `feestructure` DROP FOREIGN KEY `FeeStructure_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `feestructureitem` DROP FOREIGN KEY `FeeStructureItem_feeHeadId_fkey`;

-- DropForeignKey
ALTER TABLE `feestructureitem` DROP FOREIGN KEY `FeeStructureItem_feeStructureId_fkey`;

-- DropForeignKey
ALTER TABLE `parent` DROP FOREIGN KEY `Parent_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `parent` DROP FOREIGN KEY `Parent_userId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_collectedBy_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_studentFeeId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `paymentreceipt` DROP FOREIGN KEY `PaymentReceipt_receivedById_fkey`;

-- DropForeignKey
ALTER TABLE `paymentreceipt` DROP FOREIGN KEY `PaymentReceipt_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `paymentreceipt` DROP FOREIGN KEY `PaymentReceipt_studentFeeId_fkey`;

-- DropForeignKey
ALTER TABLE `period` DROP FOREIGN KEY `Period_dayId_fkey`;

-- DropForeignKey
ALTER TABLE `period` DROP FOREIGN KEY `Period_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_refundedBy_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_studentFeeId_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `scholarship` DROP FOREIGN KEY `Scholarship_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `schoolsubscription` DROP FOREIGN KEY `SchoolSubscription_planId_fkey`;

-- DropForeignKey
ALTER TABLE `schoolsubscription` DROP FOREIGN KEY `SchoolSubscription_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `schooltiming` DROP FOREIGN KEY `SchoolTiming_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `section` DROP FOREIGN KEY `Section_classId_fkey`;

-- DropForeignKey
ALTER TABLE `section` DROP FOREIGN KEY `Section_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_userId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_academicYearId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_classId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_promotedFromId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentacademicrecord` DROP FOREIGN KEY `StudentAcademicRecord_transportRouteId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendancerecord` DROP FOREIGN KEY `StudentAttendanceRecord_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendancerecord` DROP FOREIGN KEY `StudentAttendanceRecord_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendancesession` DROP FOREIGN KEY `StudentAttendanceSession_classId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendancesession` DROP FOREIGN KEY `StudentAttendanceSession_markedById_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendancesession` DROP FOREIGN KEY `StudentAttendanceSession_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendancesession` DROP FOREIGN KEY `StudentAttendanceSession_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `studentdiscount` DROP FOREIGN KEY `StudentDiscount_feeHeadId_fkey`;

-- DropForeignKey
ALTER TABLE `studentdiscount` DROP FOREIGN KEY `StudentDiscount_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `studentdiscount` DROP FOREIGN KEY `StudentDiscount_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentfee` DROP FOREIGN KEY `StudentFee_feeStructureId_fkey`;

-- DropForeignKey
ALTER TABLE `studentfee` DROP FOREIGN KEY `StudentFee_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `studentfee` DROP FOREIGN KEY `StudentFee_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentfeeitem` DROP FOREIGN KEY `StudentFeeItem_feeHeadId_fkey`;

-- DropForeignKey
ALTER TABLE `studentfeeitem` DROP FOREIGN KEY `StudentFeeItem_studentFeeId_fkey`;

-- DropForeignKey
ALTER TABLE `studentparent` DROP FOREIGN KEY `StudentParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentparent` DROP FOREIGN KEY `StudentParent_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentscholarship` DROP FOREIGN KEY `StudentScholarship_scholarshipId_fkey`;

-- DropForeignKey
ALTER TABLE `studentscholarship` DROP FOREIGN KEY `StudentScholarship_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `studentscholarship` DROP FOREIGN KEY `StudentScholarship_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `syllabus` DROP FOREIGN KEY `Syllabus_classId_fkey`;

-- DropForeignKey
ALTER TABLE `syllabus` DROP FOREIGN KEY `Syllabus_gradeId_fkey`;

-- DropForeignKey
ALTER TABLE `syllabus` DROP FOREIGN KEY `Syllabus_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_userId_fkey`;

-- DropForeignKey
ALTER TABLE `teachersubject` DROP FOREIGN KEY `TeacherSubject_classId_fkey`;

-- DropForeignKey
ALTER TABLE `teachersubject` DROP FOREIGN KEY `TeacherSubject_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `teachersubject` DROP FOREIGN KEY `TeacherSubject_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `teachersubject` DROP FOREIGN KEY `TeacherSubject_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_classId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_dayId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_periodId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `timetable` DROP FOREIGN KEY `Timetable_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transportroute` DROP FOREIGN KEY `TransportRoute_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `userpermission` DROP FOREIGN KEY `UserPermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `userpermission` DROP FOREIGN KEY `UserPermission_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropTable
DROP TABLE `academicyear`;

-- DropTable
DROP TABLE `admission`;

-- DropTable
DROP TABLE `auditlog`;

-- DropTable
DROP TABLE `bookpackage`;

-- DropTable
DROP TABLE `class`;

-- DropTable
DROP TABLE `classteacher`;

-- DropTable
DROP TABLE `day`;

-- DropTable
DROP TABLE `designation`;

-- DropTable
DROP TABLE `employeeattendance`;

-- DropTable
DROP TABLE `exam`;

-- DropTable
DROP TABLE `exammark`;

-- DropTable
DROP TABLE `examsubject`;

-- DropTable
DROP TABLE `feehead`;

-- DropTable
DROP TABLE `feestructure`;

-- DropTable
DROP TABLE `feestructureitem`;

-- DropTable
DROP TABLE `grade`;

-- DropTable
DROP TABLE `parent`;

-- DropTable
DROP TABLE `payment`;

-- DropTable
DROP TABLE `paymentreceipt`;

-- DropTable
DROP TABLE `payroll`;

-- DropTable
DROP TABLE `period`;

-- DropTable
DROP TABLE `permission`;

-- DropTable
DROP TABLE `plan`;

-- DropTable
DROP TABLE `refund`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `rolepermission`;

-- DropTable
DROP TABLE `scholarship`;

-- DropTable
DROP TABLE `school`;

-- DropTable
DROP TABLE `schoolrequest`;

-- DropTable
DROP TABLE `schoolsubscription`;

-- DropTable
DROP TABLE `schooltiming`;

-- DropTable
DROP TABLE `section`;

-- DropTable
DROP TABLE `staff`;

-- DropTable
DROP TABLE `student`;

-- DropTable
DROP TABLE `studentacademicrecord`;

-- DropTable
DROP TABLE `studentattendancerecord`;

-- DropTable
DROP TABLE `studentattendancesession`;

-- DropTable
DROP TABLE `studentdiscount`;

-- DropTable
DROP TABLE `studentfee`;

-- DropTable
DROP TABLE `studentfeeitem`;

-- DropTable
DROP TABLE `studentparent`;

-- DropTable
DROP TABLE `studentscholarship`;

-- DropTable
DROP TABLE `subject`;

-- DropTable
DROP TABLE `syllabus`;

-- DropTable
DROP TABLE `teacher`;

-- DropTable
DROP TABLE `teachersubject`;

-- DropTable
DROP TABLE `timetable`;

-- DropTable
DROP TABLE `token`;

-- DropTable
DROP TABLE `transaction`;

-- DropTable
DROP TABLE `transportroute`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userpermission`;

-- DropTable
DROP TABLE `userrole`;

