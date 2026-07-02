import {
  Request,
  Response,
} from "express";

import service
from "./transportRoute.service.js";

class TransportRouteController {

  // CREATE

  async create(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any)
          .user
          .schoolId;

      const data =
        await service.create({

          ...req.body,

          schoolId,
        });

      res.status(201).json({

        success: true,

        message:
          "Route created successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // GET ALL

  async getAll(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any)
          .user
          .schoolId;

      const data =
        await service.getAll(
          schoolId
        );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // GET ONE

  async getOne(
    req: Request,
    res: Response
  ) {

    try {

      const data =
        await service.getOne(

          Number(
            req.params.id
          )
        );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // UPDATE

  async update(
    req: Request,
    res: Response
  ) {

    try {

      const data =
        await service.update(

          Number(
            req.params.id
          ),

          req.body
        );

      res.json({

        success: true,

        message:
          "Route updated successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // DELETE

  async delete(
    req: Request,
    res: Response
  ) {

    try {

      await service.delete(

        Number(
          req.params.id
        )
      );

      res.json({

        success: true,

        message:
          "Route deleted successfully",
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // TOGGLE

  async toggle(
    req: Request,
    res: Response
  ) {

    try {

      const data =
        await service.toggle(

          Number(
            req.params.id
          ),

          req.body.isActive
        );

      res.json({

        success: true,

        message:
          "Status updated",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }
}

export default
new TransportRouteController();