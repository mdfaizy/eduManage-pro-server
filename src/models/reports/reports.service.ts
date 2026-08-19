import {
  ReportsRepository,
  PaymentReportQuery,
} from "./reports.repository";

export class ReportsService {
  // =====================================================
  // PAYMENT / STUDENT FEE REPORT
  // =====================================================

  static async getPaymentReport(
    schoolId: number,
    query: PaymentReportQuery = {}
  ) {
    const report =
      await ReportsRepository
        .getStudentFeePaymentReport(
          schoolId,
          query
        );

    return report;
  }
}