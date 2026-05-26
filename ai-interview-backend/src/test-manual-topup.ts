import { adminTransactionsService } from './services/admin/transactions.service';
import { TransactionType } from '@prisma/client';

async function run() {
  try {
    console.log('Testing createManualTransaction...');
    const res = await adminTransactionsService.createManualTransaction({
      userEmail: 'admin@gmail.com', // Seed data has this email
      creditsAdded: 10,
      type: TransactionType.COMPENSATION,
      reason: 'Test Error',
    });
    console.log('Success!', res);
  } catch (err) {
    console.error('Crash in createManualTransaction!', err);
  }
}

run();
