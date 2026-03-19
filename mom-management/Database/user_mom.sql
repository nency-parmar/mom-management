use mom;

CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(100),
    Role ENUM('ADMIN', 'CONVENER', 'STAFF') NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (Username, PasswordHash, FullName, Role) VALUES
('admin', 'admin123', 'Admin User', 'ADMIN'),
('john', 'john123', 'John Doe', 'CONVENER'),
('jane', 'jane123', 'Jane Smith', 'STAFF');
