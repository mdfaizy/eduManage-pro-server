import { ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

// export const validate =
//   (schema: ZodTypeAny) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const parsed = schema.parse(req.body);
//       req.body = parsed;
//       next();
//     } catch (err) {
//       if (err instanceof ZodError) {
//         return res.status(400).json({
//           message: "Validation error",
//           errors: err.issues.map(issue => ({
//             field: issue.path[0],
//             message: issue.message,
//           })),
//         });
//       }

//       return res.status(400).json({
//         message: "Invalid request data",
//       });
//     }
//   };

export const validate =
  (schema: any) =>
  (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = parsed.body || req.body;
      req.params = parsed.params || req.params;

      next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
  };
