import { Request, Response } from "express";
import {
  createDayService,
  getDaysBySchoolService,
} from "./day.service";

// export const createDay = async (req: Request, res: Response) => {
//   try {
//     const data = await createDayService(req.body);
//     res.json({ success: true, data });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

export const createDay = async (req: Request, res: Response) => {
  try {
    // 🔥 client par kabhi trust nahi
    delete req.body.schoolId;

    // ✅ JWT se schoolId lo
    const schoolId = (req as any).user.schoolId;

    const data = await createDayService({
      ...req.body,
      schoolId,
    });

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const getDaysBySchool = async (req: Request, res: Response) => {
  try {
    // ✅ JWT se schoolId lo
    const schoolId = (req as any).user.schoolId;

    const data = await getDaysBySchoolService(schoolId);

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

