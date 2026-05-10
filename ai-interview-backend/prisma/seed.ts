import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'adminpassword123';

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
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Đã tạo tài khoản Admin thành công!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  } else {
    console.log('ℹ️ Tài khoản Admin đã tồn tại, bỏ qua bước khởi tạo.');
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
