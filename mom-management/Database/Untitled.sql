use mom;

CREATE TABLE demo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO demo (name, email, city) VALUES
('Nency Parmar', 'nency@gmail.com', 'Ahmedabad'),
('Aarav Shah', 'aarav@gmail.com', 'Surat'),
('Priya Patel', 'priya@gmail.com', 'Vadodara'),
('Rohan Mehta', 'rohan@gmail.com', 'Rajkot');

SELECT * FROM demo;
use mom;
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO departments (department_name, remarks) VALUES
('Computer Engineering', 'Core technical department'),
('Mechanical Engineering', 'Mechanical systems & labs'),
('Civil Engineering', 'Infrastructure & construction'),
('Administration', 'Admin & management'),
('Human Resources', 'Staff recruitment & welfare'),
('Finance', 'Accounts & budgeting');

SELECT * FROM departments;

CREATE TABLE venues (
    venue_id VARCHAR(10) PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(150),
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO venues (venue_id, venue_name, capacity, location, remarks) VALUES
('VN-001', 'Conference Room A', 20, 'Block A – 2nd Floor', 'Projector available'),
('VN-002', 'Meeting Hall', 50, 'Main Building', 'Large screen & audio system'),
('VN-003', 'Board Room', 12, 'Admin Wing', 'Management meetings'),
('VN-004', 'Seminar Hall', 120, 'Block C – Ground Floor', 'AC & Smart Board'),
('VN-005', 'Training Room', 35, 'Block B – 1st Floor', 'Whiteboard & WiFi');
