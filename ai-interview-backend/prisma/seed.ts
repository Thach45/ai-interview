import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'adminpassword123';
  const candidateEmail = 'candidate@gmail.com';
  const candidatePassword = 'candidate123';

  // 0. Xóa tất cả user cũ (tùy chọn)
  console.log('🧹 Đang xóa dữ liệu cũ...');
  await prisma.user.deleteMany();
  console.log('✅ Dữ liệu cũ đã xóa!');

  // 1. Kiểm tra xem đã có Admin chưa
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log('🚀 Đang khởi tạo tài khoản Admin mặc định...');

    // 2. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 3. Tạo Admin mới
    await prisma.user.create({
      data: {
        email: adminEmail,
        fullName: 'System Administrator', // Thêm trường bắt buộc này
        password: hashedPassword,
        role: 'ADMIN',
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Đã tạo tài khoản Admin thành công!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  } else {
    console.log('ℹ️ Tài khoản Admin đã tồn tại, bỏ qua bước khởi tạo.');
  }

  // 4. Tạo user Candidate fake để test edit profile
  const existingCandidate = await prisma.user.findUnique({
    where: { email: candidateEmail },
  });

  if (!existingCandidate) {
    console.log('🚀 Đang khởi tạo tài khoản Candidate...');
    const hashedPassword = await bcrypt.hash(candidatePassword, 10);

    await prisma.user.create({
      data: {
        email: candidateEmail,
        password: hashedPassword,
        fullName: 'John Doe',
        role: 'CANDIDATE',
        provider: 'LOCAL',
        creditsBalance: 3,
      },
    });

    console.log('✅ Đã tạo tài khoản Candidate thành công!');
    console.log(`📧 Email: ${candidateEmail}`);
    console.log(`🔑 Password: ${candidatePassword}`);
  } else {
    console.log('ℹ️ Tài khoản Candidate đã tồn tại, bỏ qua bước khởi tạo.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
