import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK service account key
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK
if (!getApps().length) { // Check if app is already initialized
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const auth = getAuth();
const db = getFirestore();

const users = [
  {
    email: 'demo@example.com',
    password: 'password123',
    displayName: 'Demo User',
    role: 'admin'
  },
];

const clients = [
  {
    name: 'Acme Corp',
    contactEmail: 'contact@acmecorp.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown USA',
  },
  {
    name: 'Globex Inc',
    contactEmail: 'info@globex.com',
    phone: '987-654-3210',
    address: '456 Oak Ave, Otherville USA',
  },
];

const employees = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-777-8888',
    position: 'Software Engineer',
    hireDate: new Date('2020-01-15'),
    salary: 80000.00,
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-999-0000',
    position: 'Project Manager',
    hireDate: new Date('2018-06-01'),
    salary: 95000.00,
  },
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed Users
    for (const user of users) {
      try {
        const userRecord = await auth.getUserByEmail(user.email);
        console.log(`User ${user.email} already exists. Skipping creation.`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await auth.createUser({
            email: user.email,
            password: user.password,
            displayName: user.displayName,
          });
          console.log(`User ${user.email} created.`);
          // Add custom claims for role
          const userRecord = await auth.getUserByEmail(user.email);
          await auth.setCustomUserClaims(userRecord.uid, { role: user.role });
          console.log(`Custom claims set for user ${user.email}.`);
        } else {
          console.error(`Error checking or creating user ${user.email}:`, error);
        }
      }
    }

    // Seed Clients
    for (const client of clients) {
      const clientRef = db.collection('clients').where('name', '==', client.name);
      const snapshot = await clientRef.get();
      if (snapshot.empty) {
        await db.collection('clients').add({ ...client, createdAt: new Date() });
        console.log(`Client ${client.name} added.`);
      } else {
        console.log(`Client ${client.name} already exists. Skipping creation.`);
      }
    }

    // Seed Employees
    for (const employee of employees) {
      const employeeRef = db.collection('employees').where('email', '==', employee.email);
      const snapshot = await employeeRef.get();
      if (snapshot.empty) {
        await db.collection('employees').add({ ...employee, createdAt: new Date() });
        console.log(`Employee ${employee.email} added.`);
      } else {
        console.log(`Employee ${employee.email} already exists. Skipping creation.`);
      }
    }

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
