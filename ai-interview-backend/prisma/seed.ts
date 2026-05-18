import { PrismaClient, UserStatus, Role, Provider } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Đang xóa dữ liệu cũ (User, SubscriptionPackage)...');
  // Lưu ý: Trong MongoDB, deleteMany không hỗ trợ cascade nếu không định nghĩa trong schema
  // Nhưng ở đây chúng ta xóa sạch để seed lại
  await prisma.transaction.deleteMany();
  await prisma.subscriptionPackage.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Dữ liệu cũ đã xóa!');

  // 1. Tạo tài khoản Admin mặc định
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'adminpassword123';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: adminEmail,
      fullName: 'System Administrator',
      password: hashedAdminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Tài khoản Admin đã sẵn sàng!');
  console.log(`📧 Email: ${admin.email} | 🔑 Password: ${adminPassword}`);

  // 2. Tạo tài khoản Candidate mặc định
  const candidateEmail = 'candidate@gmail.com';
  const candidatePassword = 'candidate123';
  const hashedCandidatePassword = await bcrypt.hash(candidatePassword, 10);

  const candidate = await prisma.user.upsert({
    where: { email: candidateEmail },
    update: {},
    create: {
      email: candidateEmail,
      password: hashedCandidatePassword,
      fullName: 'John Doe',
      role: Role.CANDIDATE,
      provider: Provider.LOCAL,
      creditsBalance: 3,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Tài khoản Candidate đã sẵn sàng!');
  console.log(`📧 Email: ${candidate.email} | 🔑 Password: ${candidatePassword}`);

  // 3. Khởi tạo các Gói dịch vụ
  console.log('🚀 Đang khởi tạo các gói dịch vụ...');

  const packages = [
    {
      name: 'Khởi Động',
      tagline: 'Trải nghiệm nhanh',
      price: 49000,
      oldPrice: 99000,
      durationDays: 7,
      credits: 10,
      isPopular: false,
      icon: 'rocket_launch',
      features: [
        '1 lượt mô phỏng phỏng vấn thực tế',
        '10 lượt luyện tập từng câu hỏi',
        'Phản hồi AI cơ bản',
        'Câu hỏi theo ngành nghề',
      ],
    },
    {
      name: 'Chinh Phục',
      tagline: 'Được chọn nhiều nhất',
      price: 199000,
      oldPrice: 299000,
      durationDays: 30,
      credits: 50,
      isPopular: true,
      icon: 'military_tech',
      features: [
        '10 lượt mô phỏng phỏng vấn thực tế',
        '50 lượt luyện tập từng câu hỏi',
        'AI Feedback chi tiết & chuyên sâu',
        'Báo cáo kỹ năng sau mỗi buổi',
        'Ưu tiên câu hỏi mới nhất',
      ],
    },
    {
      name: 'Bứt Phá',
      tagline: 'Dành cho người nghiêm túc',
      price: 499000,
      oldPrice: 799000,
      durationDays: 90,
      credits: 150,
      isPopular: false,
      icon: 'diamond',
      features: [
        '30 lượt mô phỏng phỏng vấn thực tế',
        'Không giới hạn luyện tập câu hỏi',
        'Hỗ trợ sửa CV bằng AI (5 lượt)',
        'Phân tích biểu cảm khuôn mặt',
        'Tư vấn lộ trình sự nghiệp',
      ],
    },
    {
      name: 'Đỉnh Cao',
      tagline: 'Toàn bộ sức mạnh AI',
      price: 999000,
      oldPrice: 1499000,
      durationDays: 180,
      credits: -1, // Vô hạn
      isPopular: false,
      icon: 'auto_awesome',
      features: [
        'Không giới hạn mọi tính năng',
        'Sửa CV không giới hạn',
        'Hỗ trợ 1-1 từ chuyên gia',
        'Truy cập VIP blog chuyên sâu',
        'Huy hiệu "Master" trên hồ sơ',
      ],
    },
  ];

  for (const pkg of packages) {
    await prisma.subscriptionPackage.create({
      data: pkg,
    });
  }

  console.log('✅ Đã khởi tạo 4 gói dịch vụ thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
