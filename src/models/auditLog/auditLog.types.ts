export interface CreateAuditLogDTO {
  schoolId: number;

  userId?: number | null;

  action: string;

  entity: string;

  entityId?: number | null;

  oldData?: unknown;

  newData?: unknown;

  reason?: string | null;

  ipAddress?: string | null;

  userAgent?: string | null;
}