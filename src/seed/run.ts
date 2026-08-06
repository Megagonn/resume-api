import { connectDb } from '../config/db.ts';
import { seed } from './index.ts';

async function run() {
  await connectDb();
  await seed();
  console.log('Seed complete');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
