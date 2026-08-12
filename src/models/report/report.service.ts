// services/report.service.ts

import { ReportRepository } from "./report.repository";
import { FeeReportFilters, FeeReportData } from "./report.types";
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export class ReportService {
  private reportRepository: ReportRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
  }

  // =====================================================
  // GET REPORT
  // =====================================================

  async getReport(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getFullReport(filters);
  }

  // =====================================================
  // GET SUMMARY
  // =====================================================

  async getSummary(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getSummary(filters);
  }

  // =====================================================
  // GET CLASS WISE
  // =====================================================

  async getClassWise(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getClassWiseCollection(filters);
  }

  // =====================================================
  // GET FEE HEAD WISE
  // =====================================================

  async getFeeHeadWise(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getFeeHeadWiseCollection(filters);
  }

  // =====================================================
  // GET MONTHLY COLLECTION
  // =====================================================

  async getMonthlyCollection(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getMonthlyCollection(filters);
  }

  // =====================================================
  // GET STUDENT REPORTS
  // =====================================================

  async getStudentReports(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getStudentFeeReports(filters);
  }

  // =====================================================
  // GET PAYMENT HISTORY
  // =====================================================

  async getPaymentHistory(filters: FeeReportFilters) {
    if (!filters.schoolId) {
      throw new Error("School ID is required");
    }

    return this.reportRepository.getPaymentHistory(filters);
  }

  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  async exportToExcel(filters: FeeReportFilters) {
    const report = await this.reportRepository.exportReportData(filters);

    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Fee Collection Report'],
      [''],
      ['Summary'],
      ['Total Students', report.summary.totalStudents],
      ['Total Fee Amount', report.summary.totalFeeAmount],
      ['Total Collected', report.summary.totalCollected],
      ['Total Pending', report.summary.totalPending],
      ['Total Overdue', report.summary.totalOverdue],
      ['Collection Rate', `${report.summary.collectionRate.toFixed(2)}%`],
      ['Pending Rate', `${report.summary.pendingRate.toFixed(2)}%`],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Class Wise Sheet
    if (report.classWiseData.length > 0) {
      const classData = report.classWiseData.map((item) => ({
        'Class': item.className,
        'Total Students': item.totalStudents,
        'Total Amount': item.totalAmount,
        'Collected': item.collected,
        'Pending': item.pending,
        'Collection Rate': `${item.collectionRate.toFixed(2)}%`,
      }));
      const classSheet = XLSX.utils.json_to_sheet(classData);
      XLSX.utils.book_append_sheet(workbook, classSheet, 'Class Wise');
    }

    // Fee Head Wise Sheet
    if (report.feeHeadWiseData.length > 0) {
      const headData = report.feeHeadWiseData.map((item) => ({
        'Fee Head': item.feeHeadName,
        'Total Amount': item.totalAmount,
        'Collected': item.collected,
        'Pending': item.pending,
        'Collection Rate': `${item.collectionRate.toFixed(2)}%`,
      }));
      const headSheet = XLSX.utils.json_to_sheet(headData);
      XLSX.utils.book_append_sheet(workbook, headSheet, 'Fee Head Wise');
    }

    // Monthly Collection Sheet
    if (report.monthlyData.length > 0) {
      const monthlyData = report.monthlyData.map((item) => ({
        'Month': `${item.month} ${item.year}`,
        'Total Amount': item.totalAmount,
        'Collected': item.collected,
        'Pending': item.pending,
      }));
      const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Collection');
    }

    // Student Report Sheet
    if (report.studentData.length > 0) {
      const studentData = report.studentData.map((item) => ({
        'Student': item.studentName,
        'Admission No': item.admissionNo,
        'Class': item.className,
        'Total Fee': item.totalFee,
        'Paid': item.paidAmount,
        'Pending': item.pendingAmount,
        'Status': item.status,
        'Last Payment': item.lastPaymentDate
          ? format(new Date(item.lastPaymentDate), 'dd/MM/yyyy')
          : 'N/A',
      }));
      const studentSheet = XLSX.utils.json_to_sheet(studentData);
      XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Report');
    }

    // Payment History Sheet
    if (report.paymentHistory.length > 0) {
      const historyData = report.paymentHistory.map((item) => ({
        'Date': format(new Date(item.date), 'dd/MM/yyyy HH:mm'),
        'Receipt No': item.receiptNo,
        'Student': item.studentName,
        'Class': item.className,
        'Amount': item.amount,
        'Method': item.paymentMethod,
        'Status': item.status,
        'Received By': item.receivedBy,
      }));
      const historySheet = XLSX.utils.json_to_sheet(historyData);
      XLSX.utils.book_append_sheet(workbook, historySheet, 'Payment History');
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return excelBuffer;
  }

  // =====================================================
  // EXPORT CSV
  // =====================================================

  async exportToCSV(filters: FeeReportFilters) {
    const report = await this.reportRepository.exportReportData(filters);

    const csvData: any[] = [];

    // Add summary
    csvData.push({
      'Type': 'SUMMARY',
      'Total Students': report.summary.totalStudents,
      'Total Fee Amount': report.summary.totalFeeAmount,
      'Total Collected': report.summary.totalCollected,
      'Total Pending': report.summary.totalPending,
      'Collection Rate': `${report.summary.collectionRate.toFixed(2)}%`,
    });

    // Add class wise data
    report.classWiseData.forEach((item) => {
      csvData.push({
        'Type': 'CLASS_WISE',
        'Class': item.className,
        'Total Students': item.totalStudents,
        'Total Amount': item.totalAmount,
        'Collected': item.collected,
        'Pending': item.pending,
        'Collection Rate': `${item.collectionRate.toFixed(2)}%`,
      });
    });

    // Add student data
    report.studentData.forEach((student) => {
      csvData.push({
        'Type': 'STUDENT',
        'Student': student.studentName,
        'Admission No': student.admissionNo,
        'Class': student.className,
        'Total Fee': student.totalFee,
        'Paid': student.paidAmount,
        'Pending': student.pendingAmount,
        'Status': student.status,
        'Last Payment': student.lastPaymentDate
          ? format(new Date(student.lastPaymentDate), 'dd/MM/yyyy')
          : 'N/A',
      });
    });

    return csvData;
  }

  // =====================================================
  // GENERATE PDF
  // =====================================================

  async generatePDF(filters: FeeReportFilters) {
    const report = await this.getReport(filters);

    return {
      report,
      html: this.generateReportHTML(report),
    };
  }

  private generateReportHTML(report: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Collection Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f5f7fa; }
            .report-container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            h1 { color: #1a202c; font-size: 28px; border-bottom: 3px solid #3182ce; padding-bottom: 15px; margin-bottom: 30px; }
            .subtitle { color: #718096; font-size: 14px; margin-bottom: 30px; }
            .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
            .card { background: #f7fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .card h3 { color: #4a5568; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
            .card .value { font-size: 26px; font-weight: 700; color: #1a202c; }
            .card .sub { font-size: 13px; color: #718096; margin-top: 5px; }
            h2 { color: #2d3748; font-size: 20px; margin: 30px 0 15px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0 30px; }
            th { background: #edf2f7; padding: 12px 15px; text-align: left; font-weight: 600; font-size: 13px; color: #4a5568; }
            td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            tr:hover { background: #f7fafc; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-PAID { background: #c6f6d5; color: #276749; }
            .status-PARTIAL { background: #fefcbf; color: #975a16; }
            .status-PENDING { background: #fed7d7; color: #9b2c2c; }
            .status-OVERDUE { background: #feb2b2; color: #9b2c2c; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #718096; font-size: 13px; text-align: center; }
            @media print { body { padding: 0; background: white; } .report-container { box-shadow: none; border-radius: 0; } }
          </style>
        </head>
        <body>
          <div class="report-container">
            <h1>📊 Fee Collection Report</h1>
            <div class="subtitle">Generated: ${new Date().toLocaleString()}</div>

            <div class="summary-grid">
              <div class="card">
                <h3>Total Students</h3>
                <div class="value">${report.summary.totalStudents}</div>
              </div>
              <div class="card">
                <h3>Total Fee Amount</h3>
                <div class="value">₹${report.summary.totalFeeAmount.toLocaleString()}</div>
              </div>
              <div class="card">
                <h3>Total Collected</h3>
                <div class="value">₹${report.summary.totalCollected.toLocaleString()}</div>
                <div class="sub">${report.summary.collectionRate.toFixed(1)}% of total</div>
              </div>
              <div class="card">
                <h3>Total Pending</h3>
                <div class="value" style="color: #e53e3e;">₹${report.summary.totalPending.toLocaleString()}</div>
                <div class="sub">${report.summary.pendingRate.toFixed(1)}% of total</div>
              </div>
              <div class="card">
                <h3>Overdue</h3>
                <div class="value" style="color: #e53e3e;">${report.summary.totalOverdue}</div>
                <div class="sub">Students with overdue fees</div>
              </div>
            </div>

            <h2>📚 Class Wise Collection</h2>
            <table>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Total Amount</th>
                  <th>Collected</th>
                  <th>Pending</th>
                  <th>Collection Rate</th>
                </tr>
              </thead>
              <tbody>
                ${report.classWise.map((c: any) => `
                  <tr>
                    <td><strong>${c.className}</strong></td>
                    <td>${c.totalStudents}</td>
                    <td>₹${c.totalAmount.toLocaleString()}</td>
                    <td style="color: #276749;">₹${c.collected.toLocaleString()}</td>
                    <td style="color: #e53e3e;">₹${c.pending.toLocaleString()}</td>
                    <td>${c.collectionRate.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <h2>📋 Student Wise Report</h2>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Admission No</th>
                  <th>Class</th>
                  <th>Total Fee</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${report.studentReports.data.map((s: any) => `
                  <tr>
                    <td>${s.studentName}</td>
                    <td>${s.admissionNo}</td>
                    <td>${s.className}</td>
                    <td>₹${s.totalFee.toLocaleString()}</td>
                    <td style="color: #276749;">₹${s.paidAmount.toLocaleString()}</td>
                    <td style="color: ${s.pendingAmount > 0 ? '#e53e3e' : '#276749'};">₹${s.pendingAmount.toLocaleString()}</td>
                    <td><span class="status-badge status-${s.status}">${s.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Report generated by School Management System</p>
              <p style="font-size: 12px; margin-top: 5px;">This is a computer-generated report. No signature required.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}