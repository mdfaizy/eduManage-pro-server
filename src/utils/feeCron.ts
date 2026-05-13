import cron from "node-cron";

import prisma
from "../config/prisma.js";

cron.schedule(

  "0 1 1-5 * *",

  async () => {

    console.log(
      "Running fee generation cron..."
    );

    const students =
      await prisma
        .studentAcademicRecord
        .findMany({

          where: {
            isCurrent: true,
          },

          include: {

            student: true,

            class: true,
          },
        });

    const currentMonth =
      new Date()
        .getMonth() + 1;

    const currentYear =
      new Date()
        .getFullYear();

    for (const item of students) {

      const feeStructure =
        await prisma
          .feeStructure
          .findFirst({

            where: {

              schoolId:
                item.schoolId,

              classId:
                item.classId,

              isActive: true,
            },

            include: {
              items: true,
            },
          });

      if (!feeStructure)
        continue;

      const existing =
        await prisma
          .studentFee
          .findFirst({

            where: {

              studentId:
                item.studentId,

              feeStructureId:
                feeStructure.id,

              month:
                currentMonth,

              year:
                currentYear,
            },
          });

      if (existing)
        continue;

      await prisma
        .studentFee
        .create({

          data: {

            invoiceNo:
              `INV-${Date.now()}-${item.studentId}`,

            schoolId:
              item.schoolId,

            studentId:
              item.studentId,

            feeStructureId:
              feeStructure.id,

            month:
              currentMonth,

            year:
              currentYear,

            totalAmount:
              feeStructure.totalFee,

            paidAmount: 0,

            dueAmount:
              feeStructure.totalFee,

            status:
              "PENDING",

            dueDate:
              new Date(
                currentYear,
                currentMonth - 1,
                feeStructure.dueDay
              ),
          },
        });
    }

    console.log(
      "Fee generation completed"
    );
  }
);