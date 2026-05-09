// import { Request, Response } from "express";
// import {AdmissionService} from "./admission.service.js";

// export class AdmissionController {
//   private service = new AdmissionService();

//   // ✅ APPLY
//   async apply(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;

//       const data = await this.service.applyAdmission(
//         req.body,
//         schoolId
//       );

//       res.status(201).json({
//         success: true,
//         message: "Admission applied",
//         data,
//       });
//     } catch (e: any) {
//       res.status(400).json({
//         success: false,
//         message: e.message,
//       });
//     }
//   }

//   // ✅ APPROVE
//   async approve(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;
//       const id = Number(req.params.id);

//       const data = await this.service.approveAdmission(
//         id,
//         schoolId
//       );

//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(400).json({
//         success: false,
//         message: e.message,
//       });
//     }
//   }

//   // ❌ REJECT
//   async reject(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;
//       const id = Number(req.params.id);

//       const data = await this.service.rejectAdmission(
//         id,
//         schoolId
//       );

//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(400).json({
//         success: false,
//         message: e.message,
//       });
//     }
//   }

//   // ✏️ UPDATE
// async update(req: Request, res: Response) {
//   try {
//     const schoolId = (req as any).user.schoolId;
//     const id = Number(req.params.id);

//     const data = await this.service.updateAdmission(
//       id,
//       schoolId,
//       req.body
//     );

//     res.json({
//       success: true,
//       message: "Admission updated",
//       data,
//     });
//   } catch (e: any) {
//     res.status(400).json({
//       success: false,
//       message: e.message,
//     });
//   }
// }
// // 🔍 VIEW
// async view(req: Request, res: Response) {
//   try {
//     const schoolId = (req as any).user.schoolId;
//     const id = Number(req.params.id);

//     const data = await this.service.getAdmissionById(
//       id,
//       schoolId
//     );

//     res.json({ success: true, data });
//   } catch (e: any) {
//     res.status(404).json({
//       success: false,
//       message: e.message,
//     });
//   }
// }

//   // 📋 LIST
//   async list(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;
//       const data = await this.service.getAdmissions(schoolId);

//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(500).json({
//         success: false,
//         message: e.message,
//       });
//     }
//   }
// }

// export default new AdmissionController();


import { Request, Response }
from "express";

import { AdmissionService }
from "./admission.service.js";

export class AdmissionController {

  private service =
    new AdmissionService();

  async apply(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await this.service.applyAdmission(
          req.body,
          schoolId
        );

      res.status(201).json({

        success: true,

        message:
          "Admission applied successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }

  async approve(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      const data =
        await this.service.approveAdmission(
          id,
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

  async list(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await this.service.getAdmissions(
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
// VIEW SINGLE
// =====================================================

async view(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const id =
      Number(req.params.id);

    const data =
      await this.service.getAdmissionById(
        id,
        schoolId
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
// UPDATE
// =====================================================

async update(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const id =
      Number(req.params.id);

    const data =
      await this.service.updateAdmission(
        id,
        schoolId,
        req.body
      );

    res.json({

      success: true,

      message:
        "Admission updated successfully",

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
// REJECT
// =====================================================

async reject(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const id =
      Number(req.params.id);

    const data =
      await this.service.rejectAdmission(
        id,
        schoolId
      );

    res.json({

      success: true,

      message:
        "Admission rejected successfully",

      data,
    });

  } catch (e: any) {

    res.status(400).json({

      success: false,

      message: e.message,
    });
  }
}



}

export default new AdmissionController();