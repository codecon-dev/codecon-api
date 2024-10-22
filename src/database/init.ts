import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import { Sample } from '../entities/sample.entity';

// Load environment variables
config();

async function initializeDatabase() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Sample],
    synchronize: true, // Be careful with this in production
  });

  const sampleRepository = connection.getRepository(Sample);

  const samples = [
    { name: 'Sample 1', description: 'This is the first sample' },
    { name: 'Sample 2', description: 'This is the second sample' },
    { name: 'Sample 3', description: 'This is the third sample' },
  ];

  for (const sample of samples) {
    await sampleRepository.save(sample);
  }

  console.log('Database initialized with sample data');
  await connection.close();
}

initializeDatabase().catch(error => console.error('Database initialization failed:', error));
