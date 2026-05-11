import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'adminpassword123';

  console.log('🚀 Đang khởi tạo/cập nhật tài khoản Admin mặc định...');

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Dùng upsert: tạo mới nếu chưa có, cập nhật nếu đã tồn tại
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      // Luôn đảm bảo các trường quan trọng được set đúng
      role: 'ADMIN',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: adminEmail,
      fullName: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Tài khoản Admin đã sẵn sàng!');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log(`📌 Status: ${admin.status}`);
  console.log(`✉️  emailVerifiedAt: ${admin.emailVerifiedAt}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
