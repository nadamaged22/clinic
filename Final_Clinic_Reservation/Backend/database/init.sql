-- init.sql

-- Create Users table
CREATE TABLE IF NOT EXISTS Users
(
  id serial PRIMARY KEY,
  name varchar(100),
  email varchar(100),
  password varchar(50),
  role varchar(50)
);

-- Create Appointments table
CREATE TABLE IF NOT EXISTS Appointments
(
  id serial PRIMARY KEY NOT NULL,
  date varchar(100) NOT NULL,
  hour varchar(100) NOT NULL,
  createdBy INT NOT NULL,
  occupiedBy INT DEFAULT NULL,
  CONSTRAINT fk_doctor FOREIGN KEY(createdBy) REFERENCES Users(id),
  CONSTRAINT fk_patient FOREIGN KEY(occupiedBy) REFERENCES Users(id)
);

-- Uncomment the following lines if you want to perform additional operations
-- such as inserting data, deleting records, or updating records.

-- INSERT INTO Appointments (createdBy, date, hour) VALUES (1, 'ali', 'ali');
-- DELETE FROM Appointments WHERE id = 1;
-- UPDATE Appointments SET occupiedBy = NULL;
-- INSERT INTO Users (name, email, password, role) VALUES ('ali', 'ali', 'ali', 'doctor');
