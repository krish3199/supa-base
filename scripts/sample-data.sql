-- This script inserts sample data into the database tables.
-- It assumes the database schema has already been created by database-schema.sql.

-- Sample Users
INSERT INTO users (email, password_hash, display_name, role) VALUES
('admin@example.com', 'hashed_password_admin', 'Admin User', 'admin'),
('user1@example.com', 'hashed_password_user1', 'Regular User 1', 'user'),
('user2@example.com', 'hashed_password_user2', 'Regular User 2', 'user')
ON CONFLICT (email) DO NOTHING;

-- Sample Clients
INSERT INTO clients (name, contact_email, phone, address) VALUES
('Tech Solutions Inc.', 'contact@techsolutions.com', '555-111-2222', '100 Tech Park, Silicon Valley'),
('Global Innovations Ltd.', 'info@globalinnovations.com', '555-333-4444', '200 Innovation Drive, London'),
('Local Business Co.', 'support@localbiz.com', '555-555-6666', '300 Main Street, Anytown')
ON CONFLICT (name) DO NOTHING;

-- Sample Expenses (linking to existing users and clients)
INSERT INTO expenses (user_id, client_id, description, amount, currency, expense_date, category, notes) VALUES
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM clients WHERE name = 'Tech Solutions Inc.'), 'Software License Renewal', 1500.00, 'USD', '2024-07-01', 'Software', 'Annual license for design software'),
((SELECT id FROM users WHERE email = 'user1@example.com'), (SELECT id FROM clients WHERE name = 'Global Innovations Ltd.'), 'Travel Expenses - Client Meeting', 350.50, 'USD', '2024-07-05', 'Travel', 'Flight and hotel for client visit'),
((SELECT id FROM users WHERE email = 'admin@example.com'), NULL, 'Office Supplies', 75.20, 'USD', '2024-07-02', 'Office', 'Pens, paper, and toner'),
((SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM clients WHERE name = 'Local Business Co.'), 'Marketing Campaign Ad Spend', 1200.00, 'USD', '2024-07-10', 'Marketing', 'Google Ads campaign')
ON CONFLICT DO NOTHING; -- Assuming a unique constraint on (user_id, description, expense_date) or similar if needed

-- Sample Payments (linking to existing clients)
INSERT INTO payments (client_id, amount, currency, payment_date, method, notes) VALUES
((SELECT id FROM clients WHERE name = 'Tech Solutions Inc.'), 5000.00, 'USD', '2024-07-15', 'Bank Transfer', 'Payment for Q2 services'),
((SELECT id FROM clients WHERE name = 'Global Innovations Ltd.'), 1500.00, 'USD', '2024-07-20', 'Credit Card', 'Partial payment for project Alpha')
ON CONFLICT DO NOTHING; -- Assuming a unique constraint on (client_id, amount, payment_date) or similar if needed

-- Sample Employees
INSERT INTO employees (first_name, last_name, email, phone, position, hire_date, salary) VALUES
('John', 'Doe', 'john.doe@example.com', '555-777-8888', 'Software Engineer', '2020-01-15', 80000.00),
('Jane', 'Smith', 'jane.smith@example.com', '555-999-0000', 'Project Manager', '2018-06-01', 95000.00)
ON CONFLICT (email) DO NOTHING;
