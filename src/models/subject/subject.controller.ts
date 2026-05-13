// import { Request, Response } from "express";
// import { SubjectService } from "./subject.service";

// const service = new SubjectService();

// export class SubjectController {

  
//   async delete(req: Request, res: Response) {
//     try {
//       const { role } = req.user;
//       await service.deleteSubject(Number(req.params.id), role);
//       res.json({ message: "Subject deleted" });
//     } catch (err: any) {
//       res.status(403).json({ message: err.message });
//     }
//   }
// async create(req: Request, res: Response) {
//   try {
//     const { name, description } = req.body;
//     const { role, schoolId } = req.user;
// console.log("BODY 👉", req.body);
//     const subject = await service.createSubject(
//       { name, description },
//       role,
//       schoolId
//     );

//     res.status(201).json({ message: "Subject created", data: subject });
//   } catch (err: any) {
//     res.status(403).json({ message: err.message });
//   }
// }

//   async getAll(req: Request, res: Response) {
//     const { role, schoolId } = req.user;
//     const data = await service.getAllSubjects(role, schoolId);
//     res.json({ data });
//   }

//   async update(req: Request, res: Response) {
//     try {
//       const { role, schoolId } = req.user;
//       console.log("UPDATE BODY 👉", req.body);
//       const data = await service.updateSubject(
//         Number(req.params.id),
//         req.body,
//         role,
//         schoolId
//       );
//       res.json({ message: "Subject updated", data });
//     } catch (err: any) {
//       res.status(403).json({ message: err.message });
//     }
//   }

//   async toggle(req: Request, res: Response) {
//     try {
//       const { role } = req.user;
//       const data = await service.toggleSubject(Number(req.params.id), role);
//       res.json({ message: "Subject status updated", data });
//     } catch (err: any) {
//       res.status(403).json({ message: err.message });
//     }
//   }
//   async getById(req: Request, res: Response) {
//   try {
//     const { role, schoolId } = req.user;
//     const id = Number(req.params.id);

//     const data = await service.getSubjectById(id, role, schoolId);
//     res.json({ data });
//   } catch (err: any) {
//     res.status(403).json({ message: err.message });
//   }
// }

// }


import { Request, Response } from "express";
import { SubjectService } from "./subject.service";

const service = new SubjectService();

export class SubjectController {

  /* =========================================
     CREATE
  ========================================= */
  async create(
    req: Request,
    res: Response
  ) {

    try {

      const {
        name,
        description,
      } = req.body;

      const {
        role,
        schoolId,
      } = req.user;

      const subject =
        await service.createSubject(
          {
            name,
            description,
          },
          role,
          schoolId
        );

      res.status(201).json({
        success: true,
        message:
          "Subject created successfully",
        data: subject,
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  /* =========================================
     GET ALL
  ========================================= */
  async getAll(
    req: Request,
    res: Response
  ) {

    try {

      const {
        role,
        schoolId,
      } = req.user;

      const data =
        await service.getAllSubjects(
          role,
          schoolId
        );

      res.status(200).json({
        success: true,
        data,
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  /* =========================================
     GET BY ID
  ========================================= */
  async getById(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(
        req.params.id
      );

      const {
        role,
        schoolId,
      } = req.user;

      const data =
        await service.getSubjectById(
          id,
          role,
          schoolId
        );

      res.status(200).json({
        success: true,
        data,
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  /* =========================================
     UPDATE
  ========================================= */
  async update(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(
        req.params.id
      );

      const {
        role,
        schoolId,
      } = req.user;

      const data =
        await service.updateSubject(
          id,
          req.body,
          role,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          "Subject updated successfully",
        data,
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  /* =========================================
     TOGGLE STATUS
  ========================================= */
  async toggle(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(
        req.params.id
      );

      const {
        role,
        schoolId,
      } = req.user;

      const data =
        await service.toggleSubject(
          id,
          role,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          "Subject status updated",
        data,
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}