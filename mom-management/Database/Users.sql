SELECT * FROM mom.Meetings;
use mom;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    is_logged_in BOOLEAN DEFAULT FALSE,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role)
VALUES 
('Admin User', 'admin@mom.com', 'hashed_admin_password', 'ADMIN'),
('John Doe', 'john@mom.com', 'hashed_user_password', 'USER');

SELECT COUNT(*) AS total_users FROM users;