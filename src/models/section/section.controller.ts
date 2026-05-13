import { Request, Response } from "express";
import { SectionService } from "./section.service";
const service = new SectionService();
export class SectionController {
//  async create(req: Request, res: Response) {
//     const schoolId = req.user.schoolId;
//     const { name, classId, capacity } = req.body;
//     const data = await service.createSection(
//       name,
//       Number(classId),
//       schoolId,
//       Number(capacity)
//     );
//     res.status(201).json({ message: "Section created", data });
//   }
// async create(req: Request, res: Response) {
//   try {
//     const schoolId = req.user.schoolId;
//     const { name, classId, capacity } = req.body;

//     const parsedCapacity = Number(capacity);

//     // ✅ strong validation
//     if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Section capacity must be greater than 0",
//       });
//     }

//     const data = await service.createSection(
//       name,
//       Number(classId),
//       schoolId,
//       parsedCapacity
//     );

//     res.status(201).json({
//       success: true,
//       message: "Section created",
//       data,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

async create(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      req.user.schoolId;

    const {
      name,
      classId,
      capacity,
    } = req.body;

    // =====================================
    // OPTIONAL CAPACITY
    // =====================================

    let parsedCapacity:
      number | undefined;

    if (
      capacity === "" ||
      capacity === undefined ||
      capacity === null
    ) {

      parsedCapacity =
        undefined;

    } else {

      parsedCapacity =
        Number(capacity);
    }

    // =====================================
    // VALIDATION
    // =====================================

    if (
      parsedCapacity !== undefined &&
      parsedCapacity <= 0
    ) {

      return res.status(400).json({
        success: false,

        message:
          "Section capacity must be greater than 0",
      });
    }

    // =====================================
    // CREATE
    // =====================================

    const data =
      await service.createSection(
        name,
        Number(classId),
        schoolId,
        parsedCapacity
      );

    res.status(201).json({
      success: true,
      message:
        "Section created",
      data,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
}

async getByClass(req: Request, res: Response) {
  const schoolId = req.user.schoolId;
  const classId = req.query.classId ? Number(req.query.classId) : undefined;
  const data = await service.getSections(classId, schoolId);
  res.json({ data });
}
  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const classId = req.query.classId
      ? Number(req.query.classId)
      : undefined;
    const data = await service.getSections(classId, schoolId);
    res.json(data);
  }
async getOne(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);

    const schoolId =
      req.user.schoolId;

    const data =
      await service.getSectionById(
        id,
        schoolId
      );

    res.json({
      success: true,
      data,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
  // async delete(req: Request, res: Response) {
  //   await service.deleteSection(Number(req.params.id));
  //   res.json({ message: "Section deleted" });
  // }
  async delete(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);

    const schoolId =
      req.user.schoolId;

    await service.deleteSection(
      id,
      schoolId
    );

    res.json({
      success: true,
      message:
        "Section deleted successfully",
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
}

async toggleStatus(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);

    const schoolId =
      req.user.schoolId;

    const { isActive } =
      req.body;

    const data =
      await service.toggleStatus(
        id,
        schoolId,
        isActive
      );

    res.json({
      success: true,
      message:
        `Section ${
          isActive
            ? "activated"
            : "deactivated"
        } successfully`,
      data,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
}
  async update(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);

    const schoolId =
      req.user.schoolId;

    const updated =
      await service.updateSection(
        id,
        schoolId,
        req.body
      );

    res.json({
      success: true,
      message:
        "Section updated successfully",
      data: updated,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
} 


getSectionsByClass = async ( req: Request, res: Response ) => { try { const classId = Number( req.params.classId ); const schoolId = req.user.schoolId; const data = await service .getSectionsByClass( classId, schoolId ); res.json({ success: true, data, }); } catch (e: any) { res.status(400).json({ success: false, message: e.message, }); } };
}
