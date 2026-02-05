import { PlanRepository } from "../repositories/plan.repository.js";

export const PlanService = {
    create(payload: any) {
    return PlanRepository.create({
      name: payload.name,
      price: payload.price,
      duration: payload.duration,
      features: payload.features,
    });
  },

  list() {
    return PlanRepository.list();
  },
  getPlans() {
    return PlanRepository.list();
  },

  activateTrial(schoolId: number, planId: number) {
    return PlanRepository.assignToSchool(schoolId, planId);
  },
};
