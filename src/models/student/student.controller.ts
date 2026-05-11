// import { Request, Response } from "express";
// import { StudentService } from "./student.service.js";

// export class StudentController {
//   private service = new StudentService();
//   async updateStudent(req: Request, res: Response) {
//   try {
//     const id = Number(req.params.id);
//     const schoolId = (req as any).user.schoolId;

//     const data = await this.service.updateStudent(
//       id,
//       req.body,
//       schoolId
//     );

//     res.json({
//       success: true,
//       message: "Student updated successfully",
//       data,
//     });
//   } catch (e: any) {
//     res.status(400).json({
//       success: false,
//       message: e.message,
//     });
//   }
// }
//   async getStudents(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;
//       const data = await this.service.getStudents(schoolId);
//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(500).json({ success: false, message: e.message });
//     }
//   }

//   async getStudent(req: Request, res: Response) {
//     try {
//       const id = Number(req.params.id);
//       const user = (req as any).user;

//       const data = await this.service.getStudent(id, user);
//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(403).json({ success: false, message: e.message });
//     }
//   }
//   async enableLogin(req: Request, res: Response) {
//   try {
//     const schoolId = (req as any).user.schoolId;
//     const { studentId, email } = req.body;

//     const data = await this.service.enableStudentLogin(
//       studentId,
//       email,
//       schoolId
//     );

//     res.json({ success: true, data });
//   } catch (e: any) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// }

// async updateStudentStatus(req: Request, res: Response) {
//   try {
//     const id = Number(req.params.id);
//     const schoolId = (req as any).user.schoolId;
//     const { isActive } = req.body;

//     const data = await this.service.updateStudentStatus(
//       id,
//       isActive,
//       schoolId
//     );

//     res.json({
//       success: true,
//       message: "Student status updated",
//       data,
//     });
//   } catch (e: any) {
//     res.status(400).json({
//       success: false,
//       message: e.message,
//     });
//   }
// }
//   async linkParent(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;
//       const { studentId, parentEmail, parentName } = req.body;

//       const data = await this.service.linkParent(
//         studentId,
//         parentEmail,
//         parentName,
//         schoolId
//       );

//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(400).json({ success: false, message: e.message });
//     }
//   }

//   async deleteStudent(req: Request, res: Response) {
//     try {
//       const id = Number(req.params.id);
//       await this.service.deleteStudent(id);
//       res.json({ success: true, message: "Student deleted" });
//     } catch (e: any) {
//       res.status(400).json({ success: false, message: e.message });
//     }
//   }
// }

// export default new StudentController();

import { Request, Response } from "express";

import { StudentService }
from "./student.service.js";

export class StudentController {

  private service =
    new StudentService();

  // =====================================================
  // LIST
  // =====================================================

  async getStudents(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await this.service.getStudents(
          schoolId
        );

      res.json({
        success: true,
        data,
      });

    } catch (e: any) {

      res.status(500).json({

        success: false,

        message: e.message,
      });
    }
  }

  // =====================================================
  // SINGLE
  // =====================================================

  async getStudent(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        Number(req.params.id);

      const user =
        (req as any).user;

      const data =
        await this.service.getStudent(
          id,
          user
        );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(404).json({

        success: false,

        message: e.message,
      });
    }
  }

  // =====================================================
  // ENABLE LOGIN
  // =====================================================

  async enableLogin(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const {
        studentId,
        email,
      } = req.body;

      const data =
        await this.service.enableStudentLogin(
          studentId,
          email,
          schoolId
        );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }

  // =====================================================
  // LINK PARENT
  // =====================================================

async enableParentLogin(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const {
      parentId,
      email,
    } = req.body;

    const data =
      await this.service
        .enableParentLogin(

          parentId,

          email,

          schoolId
        );

    res.json({

      success: true,

      data,
    });

  } catch (e: any) {

    res.status(400).json({

      success: false,

      message: e.message,
    });
  }
}

  // =====================================================
  // UPDATE
  // =====================================================

  async updateStudent(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        Number(req.params.id);

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await this.service.updateStudent(
          id,
          req.body,
          schoolId
        );

      res.json({

        success: true,

        message:
          "Student updated successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }

  // =====================================================
  // STATUS
  // =====================================================

  async updateStudentStatus(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        Number(req.params.id);

      const schoolId =
        (req as any).user.schoolId;

      const { isActive } =
        req.body;

      const data =
        await this.service.updateStudentStatus(
          id,
          isActive,
          schoolId
        );

      res.json({

        success: true,

        message:
          "Student status updated",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async deleteStudent(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        Number(req.params.id);

      await this.service.deleteStudent(
        id
      );

      res.json({

        success: true,

        message:
          "Student deleted",
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }
}

export default new StudentController();