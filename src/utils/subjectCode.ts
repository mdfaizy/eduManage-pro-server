// utils/subjectCode.ts
export const generateSubjectCode = (name: string, schoolId: number) => {
  const prefix = name
    .replace(/[^A-Z]/gi, "")
    .substring(0, 3)
    .toUpperCase();

  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${schoolId}-${random}`;
};
