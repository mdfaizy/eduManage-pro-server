import express from "express";

import authRoutes from "../models/auth/auth.routes.js";
import roleRoutes from "../models/role/role.routes.js";
import permissionRoutes from "../models/permission/permission.routes.js";
import userRoutes from "../models/user/user.rotes.js";
import gradeRoute from '../models/grade/grade.routes.js'
// import masterSubject from "../models/masterSubject/masterSubject.routes.js"
import classRoutes from "../models/class/class.routes.js";
import sectionRoutes from "../models/section/section.routes.js"; 
import subjectRoutes from "../models/subject/subject.routes.js";
import assignTeacherToClassRoutes from "../models/classTeacher/classTeacher.routes.js";
import teacherSubjectRoutes from "../models/teacherSubject/teacherSubject.routes.js";
import teachersRoute from "../models/teacher/teacher.routes.js"
import studentRoutes from "../models/student/student.routes.js";
import syllabusRoutes from "../models/syllabus/syllabus.routes.js"
import timetableRoutes from "../models/timetable/timetable.routes.js";
import academicYearRoutes from "../models/academicYear/academicYear.route.js"
import dayRoutes from "../models/day/day.routes.js"
import periodRoutes from "../models/period/period.routes.js"
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/users", userRoutes);
router.use('/grades',gradeRoute)
// router.use("/master-subject",masterSubject);
router.use("/classes", classRoutes);
router.use("/teachers", teachersRoute);
router.use("/sections", sectionRoutes);
router.use("/subjects", subjectRoutes);
router.use('/syllabus',syllabusRoutes);
router.use("/assign-teacher", assignTeacherToClassRoutes);
router.use("/teacher-subjects", teacherSubjectRoutes);
// router.use("/api/day", dayRoutes);

router.use("/academic-year", academicYearRoutes);
router.use("/day", dayRoutes);
router.use("/period", periodRoutes);


router.use("/students", studentRoutes);


router.use("/timetable", timetableRoutes);

export default router;
