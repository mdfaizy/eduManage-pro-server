import { Request, Response } from "express";
import { TimetableService } from "./timetable.service";
import { TeacherRepository } from "../teacher/teacher.repository";

const service = new TimetableService();
const teacherRepo = new TeacherRepository();

export class TimetableController {
  /* =====================================================
     BULK CREATE (ADMIN)
  ===================================================== */
  async bulkCreate(req: Request, res: Response) {
    try {
      const { classId, sectionId, academicYearId, schedule } = req.body;
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!classId || !sectionId || !academicYearId || !schedule?.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid data",
        });
      }

      const result = await service.bulkCreate({
        schoolId,
        classId: Number(classId),
        sectionId: Number(sectionId),
        academicYearId: Number(academicYearId),
        schedule,
      });

      return res.json({
        success: true,
        message: "Timetable saved successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("BULK TIMETABLE ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message || "Failed to save timetable",
      });
    }
  }

  /* =====================================================
     GET ALL (ADMIN OPTIONAL)
  ===================================================== */
  async getAll(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const data = await service.getAll(schoolId);

      return res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /* =====================================================
     ADMIN TIMETABLE VIEW
  ===================================================== */
  async getAdminTimetable(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const academicYearId = Number(req.query.academicYearId);

      if (!req.user?.roles?.includes("SCHOOL_ADMIN")) {
        return res.status(403).json({
          success: false,
          message: "Only admin can view all timetables",
        });
      }

      if (!schoolId || !academicYearId) {
        return res.status(400).json({
          success: false,
          message: "academicYearId required",
        });
      }

      const data = await service.getAdminTimetable(
        schoolId,
        academicYearId
      );

      const formatted = data.map((t: any) => ({
        id: t.id,
        teacherName: t.teacher.user.name,
        className: t.class.name,
        section: t.section.name,
        subject: t.subject.name,
        day: t.period.day.name,
        periodNumber: t.period.periodNumber,
        startTime: t.period.startTime,
        endTime: t.period.endTime,

      }));

      return res.json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  /* =====================================================
     TEACHER MY TIMETABLE (🔥 FIXED)
  ===================================================== */
  async getMyTimetable(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const schoolId = req.user?.schoolId; // ⭐ IMPORTANT
      const academicYearId = Number(req.query.academicYearId);

      if (!userId || !schoolId || !academicYearId) {
        return res.status(400).json({
          success: false,
          message: "Missing required data",
        });
      }

      const teacher = await teacherRepo.findByUserId(userId);

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher profile not found for this user",
        });
      }

      // ⭐⭐⭐ MULTI-TENANT SAFE CALL
      const data = await service.getTeacherTimetable(
        schoolId,
        teacher.id,
        academicYearId
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }

  /* =====================================================
     DELETE SINGLE ENTRY
  ===================================================== */
  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }

      await service.remove(id);

      return res.json({
        success: true,
        message: "Timetable entry removed",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
