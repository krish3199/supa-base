-- Insert sample users (these will be created after user signup)
-- Note: In Supabase, users are created through auth.users table via signup process

-- Insert sample clients
INSERT INTO public.clients (name, email, phone, address, created_by) VALUES
('ABC Corporation', 'contact@abc-corp.com', '+1-555-0101', '123 Business St, City, State 12345', (SELECT id FROM auth.users LIMIT 1)),
('XYZ Ltd', 'info@xyz-ltd.com', '+1-555-0102', '456 Commerce Ave, City, State 12346', (SELECT id FROM auth.users LIMIT 1)),
('Tech Solutions Inc', 'hello@techsolutions.com', '+1-555-0103', '789 Innovation Blvd, City, State 12347', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample expenses
INSERT INTO public.expenses (title, amount, category, description, date, status, client_id, created_by) VALUES
('Office Supplies', 150.00, 'Office', 'Pens, papers, and other office supplies', '2024-01-15', 'approved', (SELECT id FROM public.clients WHERE name = 'ABC Corporation' LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
('Business Lunch', 85.50, 'Meals', 'Client meeting lunch at downtown restaurant', '2024-01-16', 'pending', (SELECT id FROM public.clients WHERE name = 'XYZ Ltd' LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
('Software License', 299.99, 'Software', 'Annual subscription for project management tool', '2024-01-17', 'approved', (SELECT id FROM public.clients WHERE name = 'Tech Solutions Inc' LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
('Travel Expenses', 450.00, 'Travel', 'Flight tickets for business trip', '2024-01-18', 'pending', (SELECT id FROM public.clients WHERE name = 'ABC Corporation' LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
('Marketing Materials', 200.00, 'Marketing', 'Brochures and business cards printing', '2024-01-19', 'approved', (SELECT id FROM public.clients WHERE name = 'XYZ Ltd' LIMIT 1), (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample payments
INSERT INTO public.payments (amount, payment_date, payment_method, description, client_id, created_by) VALUES
(1500.00, '2024-01-20', 'Bank Transfer', 'Monthly service payment', (SELECT id FROM public.clients WHERE name = 'ABC Corporation' LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
(750.00, '2024-01-21', 'Credit Card', 'Project milestone payment', (SELECT id FROM public.clients WHERE name = 'XYZ Ltd' LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
(2200.00, '2024-01-22', 'Check', 'Quarterly consulting fee', (SELECT id FROM public.clients WHERE name = 'Tech Solutions Inc' LIMIT 1), (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;
