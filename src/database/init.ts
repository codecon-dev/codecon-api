import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Attendee } from '../entities/attendee.entity';

// Load environment variables
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Attendee],
  synchronize: true, // Be careful with this in production
});

async function initializeDatabase() {
  console.log('Starting database initialization...');

  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');

    const attendeeRepository = AppDataSource.getRepository(Attendee);

    const attendees = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        points: 100,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Dev Inc',
        points: 150,
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        company: 'Code LLC',
        points: 75,
      },
    ];

    console.log(`Inserting ${attendees.length} sample attendees...`);
    for (const attendee of attendees) {
      await attendeeRepository.save(attendee);
      console.log(`Inserted attendee: ${attendee.name}`);
    }

    console.log('All sample attendees inserted successfully.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
}

initializeDatabase()
  .then(() => console.log('Database initialization completed successfully.'))
  .catch((error) => console.error('Database initialization failed:', error));
