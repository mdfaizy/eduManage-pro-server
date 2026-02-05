import { PlanService } from "../services/plan.service.js";

export const PlanController = {

  async create(req, res) {
    try {
      const plan = await PlanService.create(req.body);
      res.status(201).json(plan);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async list(req, res) {
    try {
      const plans = await PlanService.list();
      res.json(plans);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  async activateTrial(req, res) {
    try {
      const { planId } = req.body;
      const { schoolId } = req.user;

      await PlanService.activateTrial(schoolId, planId);
      res.json({ message: "Plan activated successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
