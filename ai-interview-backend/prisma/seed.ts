import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'adminpassword123';
  const candidateEmail = 'candidate@gmail.com';
  const candidatePassword = 'candidate123';

  console.log('🧹 Đang xóa dữ liệu cũ...');
  await prisma.user.deleteMany();
  console.log('✅ Dữ liệu cũ đã xóa!');

  console.log('🚀 Đang mã hóa mật khẩu...');
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedCandidatePassword = await bcrypt.hash(candidatePassword, 10);

  // 1. Tạo tài khoản Admin bằng upsert
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: adminEmail,
      fullName: 'System Administrator',
      password: hashedAdminPassword,
      role: 'ADMIN',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Tài khoản Admin đã sẵn sàng!');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log(`📌 Status: ${admin.status}`);

  // 2. Tạo tài khoản Candidate bằng upsert
  const candidate = await prisma.user.upsert({
    where: { email: candidateEmail },
    update: {
      role: 'CANDIDATE',
      status: UserStatus.ACTIVE,
    },
    create: {
      email: candidateEmail,
      fullName: 'John Doe',
      password: hashedCandidatePassword,
      role: 'CANDIDATE',
      status: UserStatus.ACTIVE,
      creditsBalance: 3,
    },
  });

  console.log('✅ Tài khoản Candidate đã sẵn sàng!');
  console.log(`📧 Email: ${candidate.email}`);
  console.log(`🔑 Password: ${candidatePassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
