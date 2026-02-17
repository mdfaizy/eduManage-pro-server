// // src/models/teacher/teacher.controller.ts
// import { Request, Response } from "express";
// import { TeacherService } from "./teacher.service";

// // const service = new TeacherService();

// export class TeacherController {
//   private service = new TeacherService();
//   // async create(req: Request, res: Response) {
//   //   try {
//   //     const schoolId = (req as any).user.schoolId;
//   //     const { userId } = req.body;

//   //     const teacher = await service.createTeacher(userId, schoolId);

//   //     res.status(201).json({
//   //       message: "Teacher profile created",
//   //       teacher,
//   //     });
//   //   } catch (err: any) {
//   //     res.status(400).json({ message: err.message });
//   //   }
//   // }

//    async createTeacher(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;

//       const userId = Number(req.body.userId);
//       if (!userId || isNaN(userId)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid userId",
//         });
//       }

//       const teacher = await this.service.createTeacher(userId, schoolId);

//       res.status(201).json({
//         success: true,
//         message: "Teacher profile created successfully",
//         data: teacher,
//       });
//     } catch (e: any) {
//       console.error("CREATE TEACHER ERROR 👉", e);

//       res.status(e.statusCode || 500).json({
//         success: false,
//         message: e.message || "Failed to create teacher profile",
//       });
//     }
//   }

//   async getTeachers(req: Request, res: Response) {
//     const schoolId = (req as any).user.schoolId;
//     const teachers = await this.service.getTeachers(schoolId);
//     res.json({ success: true, data: teachers });
//   }


//   // async getTeachers(req: Request, res: Response) {
//   //   try {
//   //     const schoolId = (req as any).user.schoolId;
//   //     const teachers = await this.service.getTeachers(schoolId);

//   //     res.json({ success: true, data: teachers });
//   //   } catch (e: any) {
//   //     res.status(500).json({ success: false, message: e.message });
//   //   }
//   // }

//   async getAll(req: Request, res: Response) {
//     const schoolId = (req as any).user.schoolId;
//     const data = await service.getTeachers(schoolId);
//     res.json(data);
//   }

//   async getOne(req: Request, res: Response) {
//     const data = await service.getTeacher(Number(req.params.id));
//     res.json(data);
//   }
//    async update(req: Request, res: Response) {
//   try {
//     const teacherId = Number(req.params.id);
//     const { name, email } = req.body;

//     const teacher = await service.getTeacher(teacherId);
//     const userId = teacher.userId;

//     const updated = await service.updateTeacherUser(userId, name, email);

//     res.json({ message: "Teacher updated", updated });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// }


// }




import { Request, Response } from "express";
import { TeacherService } from "./teacher.service";

export class TeacherController {
  private service = new TeacherService();

  /* ================= CREATE TEACHER PROFILE ================= */
  // async createTeacher(req: Request, res: Response) {
  //   try {
  //     const schoolId = (req as any).user.schoolId;

  //     const userId = Number(req.body.userId);
  //     if (!userId || isNaN(userId)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid userId",
  //       });
  //     }

  //     const teacher = await this.service.createTeacher(userId, schoolId);

  //     return res.status(201).json({
  //       success: true,
  //       message: "Teacher profile created successfully",
  //       data: teacher,
  //     });
  //   } catch (e: any) {
  //     console.error("CREATE TEACHER ERROR 👉", e);

  //     return res.status(e.statusCode || 500).json({
  //       success: false,
  //       message: e.message || "Failed to create teacher profile",
  //     });
  //   }
  // }

  async createTeacher(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const { userId, phone, gender, joiningDate, qualification } = req.body;

      const teacher = await this.service.createTeacher(
        Number(userId),
        schoolId,
        { phone, gender, joiningDate, qualification }
      );

      res.status(201).json({
        success: true,
        message: "Teacher profile created",
        data: teacher,
      });
    } catch (e: any) {
      res.status(e.statusCode || 500).json({
        success: false,
        message: e.message,
      });
    }
  }

  /* ================= GET ALL TEACHERS (BY SCHOOL) ================= */
  async getTeachers(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const teachers = await this.service.getTeachers(schoolId);

      return res.json({
        success: true,
        data: teachers,
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }

  /* ================= GET SINGLE TEACHER ================= */
  async getOne(req: Request, res: Response) {
    try {
      const teacherId = Number(req.params.id);
      if (!teacherId || isNaN(teacherId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teacher id",
        });
      }

      const teacher = await this.service.getTeacher(teacherId);

      return res.json({
        success: true,
        data: teacher,
      });
    } catch (e: any) {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }
  }

  /* ================= UPDATE TEACHER (USER DETAILS) ================= */
 async update(req: Request, res: Response) {
  try {
    const teacherId = Number(req.params.id);
    if (isNaN(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher id",
      });
    }

    const {
      name,
      email,
      phone,
      gender,
      qualification,
      joiningDate,
    } = req.body;

    const updated = await this.service.updateTeacher(
      teacherId,
      { name, email },
      { phone, gender, qualification, joiningDate }
    );

    return res.json({
      success: true,
      message: "Teacher updated successfully",
      data: updated,
    });
  } catch (e: any) {
    return res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
}

  async toggleStatus(req: Request, res: Response) {
  try {
    const teacherId = Number(req.params.id);
    if (!teacherId || isNaN(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher id",
      });
    }

    const teacher = await this.service.getTeacher(teacherId);

    const updatedUser = await this.service.toggleTeacherStatus(
      teacher.userId
    );

    return res.json({
      success: true,
      message: "Teacher status updated",
      data: updatedUser,
    });
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
}

}

export default new TeacherController();
