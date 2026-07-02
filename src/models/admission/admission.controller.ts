import { Request, Response } from "express";
import { AdmissionService }from "./admission.service.js";

export class AdmissionController {
  private service =new AdmissionService();
  async apply(req: Request,res: Response) {
    try {
      const schoolId =(req as any).user.schoolId;
      const data =await this.service.applyAdmission(req.body,schoolId);
      res.status(201).json({
        success: true,
        message:"Admission applied successfully",
        data,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }
  async approve(req: Request,res: Response){
    try {
      const schoolId =(req as any).user.schoolId;
      const id =Number(req.params.id);
      const data =await this.service.approveAdmission(
          id,schoolId);
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

  async list(req: Request, res: Response) {

  try {

    const schoolId = (req as any).user.schoolId;

    const {
      classId,
      sectionId,
      academicYearId,
      status,
    } = req.query;

    const data = await this.service.getAdmissions(
      schoolId,
      classId ? Number(classId) : undefined,
      sectionId ? Number(sectionId) : undefined,
      academicYearId ? Number(academicYearId) : undefined,
      status ? String(status) : undefined
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


  // async list(

  //   req: Request,
  //   res: Response
  // ) {

  //   try {

  //     const schoolId =
  //       (req as any).user.schoolId;

  //     const data =
  //       await this.service.getAdmissions(
  //         schoolId
  //       );

  //     res.json({

  //       success: true,

  //       data,
  //     });

  //   } catch (e: any) {

  //     res.status(500).json({

  //       success: false,

  //       message: e.message,
  //     });
  //   }
  // }

// =====================================================
// VIEW SINGLE
// =====================================================

async view(
  req: Request,
  res: Response
) {
   console.log("REQ URL =>", req.originalUrl);
  console.log("REQ PARAMS =>", req.params);
  console.log("REQ PARAM ID =>", req.params.id);

  try {

    const schoolId =
      (req as any).user.schoolId;

    const id =
      Number(req.params.id);
console.log("NUMBER ID =>", id);
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

async reports(req: Request, res: Response) {
  try {
    const schoolId = (req as any).user.schoolId;

   const {
  classId,
  sectionId,
  academicYearId,
  startDate,
  endDate,
} = req.query;

const data = await this.service.getReports(
  schoolId,
  classId ? Number(classId) : undefined,
  sectionId ? Number(sectionId) : undefined,
  academicYearId ? Number(academicYearId) : undefined,
  startDate ? String(startDate) : undefined,
  endDate ? String(endDate) : undefined
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

}

export default new AdmissionController();