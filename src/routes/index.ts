import express from "express";

import authRoutes from "../models/auth/auth.routes.js";
import roleRoutes from "../models/role/role.routes.js";
import permissionRoutes from "../models/permission/permission.routes.js";
import userRoutes from "../models/user/user.rotes.js";
import gradeRoute from '../models/grade/grade.routes.js'
import masterSubject from "../models/masterSubject/masterSubject.routes.js"
import classRoutes from "../models/class/class.routes.js";
import sectionRoutes from "../models/section/section.routes.js"; 
import subjectRoutes from "../models/subject/subject.routes.js";
import assignTeacherToClassRoutes from "../models/classTeacher/classTeacher.routes.js";
import teachersRoute from "../models/teacher/teacher.routes.js"
import studentRoutes from "../models/student/student.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/users", userRoutes);
router.use('/grades',gradeRoute)
router.use("/master-subject",masterSubject);
router.use("/classes", classRoutes);
router.use("/teachers", teachersRoute);
router.use("/sections", sectionRoutes);
router.use("/subjects", subjectRoutes);
router.use("/assign-teacher", assignTeacherToClassRoutes);
router.use("/students", studentRoutes);
export default router;
