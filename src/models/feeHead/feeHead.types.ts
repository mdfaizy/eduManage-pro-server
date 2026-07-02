export interface CreateFeeHeadDTO {

  schoolId: number;

  name: string;

  description?: string;
}

export interface UpdateFeeHeadDTO {

  name?: string;

  description?: string;

  isActive?: boolean;
}