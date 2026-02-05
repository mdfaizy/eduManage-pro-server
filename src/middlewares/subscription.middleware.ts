import prisma from "../config/prisma.js";

export const checkSubscription = (feature: string) => {
  return async (req, res, next) => {
    const { schoolId } = req.user;

    const subscription = await prisma.schoolSubscription.findFirst({
      where: {
        schoolId,
        status: "ACTIVE",
        endDate: { gt: new Date() },
      },
      include: { plan: true },
    });

    if (!subscription) {
      return res.status(403).json({
        message: "Please buy a plan",
      });
    }

    if (!subscription.plan.features.includes(feature)) {
      return res.status(403).json({
        message: "Upgrade plan to use this feature",
      });
    }

    next();
  };
};
