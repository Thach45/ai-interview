import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionService } from '../modules/authorization/permissions/permission.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const result = await app.get(PermissionService).sync();
    console.log(JSON.stringify(result));
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
