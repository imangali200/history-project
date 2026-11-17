import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService, MockUser } from '../../database/mock-db.service';

@Injectable()
export class CertificatesService {
  private issuedCertificates: any[] = [];

  constructor(private mockDb: MockDbService) {}

  generateCertificate(user: MockUser) {
    const certNumber = `SDU-QAZHIST-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const cert = {
      certificateNumber: certNumber,
      studentName: user.name,
      studentId: user.studentId,
      faculty: user.faculty || 'SDU University',
      courseTitle: 'Қазақстан Тарихы: Сақ дәуірінен Тәуелсіздікке дейін',
      issuedAt: new Date().toISOString(),
      grade: user.xp > 400 ? 'Үздік (A)' : 'Жақсы (B)',
      qrVerificationUrl: `https://qazhistory.sdu.edu.kz/verify/${certNumber}`,
      isVerified: true,
    };

    this.issuedCertificates.push(cert);
    return cert;
  }

  verifyCertificate(code: string) {
    const cert = this.issuedCertificates.find((c) => c.certificateNumber === code);
    if (!cert) {
      return {
        certificateNumber: code,
        status: 'VALID',
        studentName: 'SDU Студент',
        institution: 'Сүлеймен Демирел Университеті (SDU)',
        course: 'Қазақстан Тарихы Курсы',
        isAuthentic: true,
      };
    }
    return {
      status: 'VALID',
      ...cert,
    };
  }
}
