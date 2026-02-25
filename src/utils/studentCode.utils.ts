// ⭐ MUST HAVE export

export async function generateStudentCode(tx: any, schoolId: number) {
  const lastStudent = await tx.student.findFirst({
    where: { schoolId },
    orderBy: { id: "desc" },
    select: { studentCode: true },
  });

  let nextNumber = 1;

  if (lastStudent?.studentCode) {
    const num = parseInt(
      lastStudent.studentCode.split("-").pop() || "0"
    );
    nextNumber = num + 1;
  }

  return `STU-${nextNumber.toString().padStart(6, "0")}`;
}