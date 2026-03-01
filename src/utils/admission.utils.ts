import prisma from "../config/prisma.js";

// ✅ Generate Roll Number
export async function generateRollNumber(
  schoolId: number,
  academicYearId: number,
  classId: number,
  sectionId?: number | null
) {
  const count = await prisma.admission.count({
    where: {
      schoolId,
      academicYearId,
      classId,
      sectionId: sectionId ?? null,
      status: "ACTIVE",
    },
  });

  return count + 1;
}

// ✅ Generate Admission Number
export async function generateAdmissionNo(schoolId: number) {
  const year = new Date().getFullYear();

  const count = await prisma.admission.count({
    where: { schoolId },
  });

  return `ADM-${year}-${String(count + 1).padStart(4, "0")}`;
}

// ✅ Check section capacity
export async function checkSectionCapacity(sectionId: number) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      admissions: {
        where: { status: "ACTIVE" },
      },
    },
  });

  if (!section) throw new Error("Section not found");

  if (section.admissions.length >= section.capacity) {
    throw new Error("Section is full");
  }
}