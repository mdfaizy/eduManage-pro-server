import { ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.issues.map(issue => ({
            field: issue.path[0],
            message: issue.message,
          })),
        });
      }

      return res.status(400).json({
        message: "Invalid request data",
      });
    }
  };
