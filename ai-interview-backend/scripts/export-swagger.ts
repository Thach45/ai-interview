import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../src/config/swagger.config';

const outputPath = path.join(__dirname, '../swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log(`Đã xuất tài liệu OpenAPI/Swagger thành công ra file: ${outputPath}`);
