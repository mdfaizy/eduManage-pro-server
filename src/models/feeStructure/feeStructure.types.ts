export type FeeFrequency =
  | "MONTHLY"
  | "YEARLY"
  | "ONE_TIME";

export interface FeeStructureItemDTO {

  feeHeadId: number;

  amount: number;

  frequency: FeeFrequency;

  isOptional?: boolean;
}

export interface CreateFeeStructureDTO {

  schoolId: number;

  academicYearId: number;

  classId: number;

  name: string;

  dueDay: number;

  items: FeeStructureItemDTO[];
}

export interface UpdateFeeStructureDTO {

  academicYearId?: number;

  classId?: number;

  name?: string;

  dueDay?: number;

  items?: FeeStructureItemDTO[];
}