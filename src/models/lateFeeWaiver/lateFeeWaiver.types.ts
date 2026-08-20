export interface CreateLateFeeWaiverDTO {
  schoolId: number;
  studentFeeId: number;
  amount: number;
  reason: string;
  waivedBy: number;
}