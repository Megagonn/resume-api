import { connectDb } from '../config/db.js';
import { seed } from './index.js';

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
