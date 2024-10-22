import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import { Attendee } from '../entities/attendee.entity';

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
    entities: [Attendee],
    synchronize: true, // Be careful with this in production
  });

  const attendeeRepository = connection.getRepository(Attendee);

  const attendees = [
    { name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', points: 100 },
    { name: 'Jane Smith', email: 'jane@example.com', company: 'Dev Inc', points: 150 },
    { name: 'Bob Johnson', email: 'bob@example.com', company: 'Code LLC', points: 75 },
  ];

  for (const attendee of attendees) {
    await attendeeRepository.save(attendee);
  }

  console.log('Database initialized with sample attendees');
  await connection.close();
}

initializeDatabase().catch(error => console.error('Database initialization failed:', error));
