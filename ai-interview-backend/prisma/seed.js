"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'adminpassword123';
        const candidateEmail = 'candidate@gmail.com';
        const candidatePassword = 'candidate123';
        console.log('🧹 Đang xóa dữ liệu cũ...');
        yield prisma.user.deleteMany();
        console.log('✅ Dữ liệu cũ đã xóa!');
        console.log('🚀 Đang mã hóa mật khẩu...');
        const hashedAdminPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
        const hashedCandidatePassword = yield bcryptjs_1.default.hash(candidatePassword, 10);
        const admin = yield prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                role: 'ADMIN',
                status: client_1.UserStatus.ACTIVE,
                emailVerifiedAt: new Date(),
            },
            create: {
                email: adminEmail,
                fullName: 'System Administrator',
                password: hashedAdminPassword,
                role: 'ADMIN',
                status: client_1.UserStatus.ACTIVE,
                emailVerifiedAt: new Date(),
            },
        });
        console.log('✅ Tài khoản Admin đã sẵn sàng!');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log(`📌 Status: ${admin.status}`);
        const candidate = yield prisma.user.upsert({
            where: { email: candidateEmail },
            update: {
                role: 'CANDIDATE',
                status: client_1.UserStatus.ACTIVE,
            },
            create: {
                email: candidateEmail,
                fullName: 'John Doe',
                password: hashedCandidatePassword,
                role: 'CANDIDATE',
                status: client_1.UserStatus.ACTIVE,
                creditsBalance: 3,
            },
        });
        console.log('✅ Tài khoản Candidate đã sẵn sàng!');
        console.log(`📧 Email: ${candidate.email}`);
        console.log(`🔑 Password: ${candidatePassword}`);
    });
}
main()
    .catch((e) => {
    console.error('❌ Lỗi Seeder:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
