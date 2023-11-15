-- Create a new database
CREATE DATABASE AddressBookDB;

-- Switch to the newly created database
USE AddressBookDB;

-- Create the Contacts table
CREATE TABLE Contacts (
    ContactID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    EmailAddress VARCHAR(100),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY UniqueEmail (EmailAddress)
);
-- Add the Address column to the Contacts table
ALTER TABLE Contacts
ADD COLUMN Address VARCHAR(255);


-- Create the Addresses table
CREATE TABLE Addresses (
    AddressID INT PRIMARY KEY AUTO_INCREMENT,
    ContactID INT,
    StreetAddress VARCHAR(255),
    City VARCHAR(50),
    State VARCHAR(50),
    PostalCode VARCHAR(20),
    FOREIGN KEY (ContactID) REFERENCES Contacts(ContactID) ON DELETE CASCADE
);

-- Create the Notes table
CREATE TABLE Notes (
    NoteID INT PRIMARY KEY AUTO_INCREMENT,
    ContactID INT,
    NoteText TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ContactID) REFERENCES Contacts(ContactID) ON DELETE CASCADE
);

-- Insert sample data into Contacts table
INSERT INTO Contacts (FirstName, LastName, PhoneNumber, EmailAddress)
VALUES ('John', 'Doe', '1234567890', 'john.doe@example.com'),
       ('Alice', 'Smith', '9876543210', 'alice.smith@example.com'),
       ('Bob', 'Johnson', '5551234567', 'bob.johnson@example.com');

-- Insert sample data into Addresses table
INSERT INTO Addresses (ContactID, StreetAddress, City, State, PostalCode)
VALUES (1, '123 Main St', 'Anytown', 'CA', '12345'),
       (2, '456 Elm St', 'Sometown', 'NY', '67890'),
       (3, '789 Oak St', 'Otherstown', 'TX', '13579');

-- Insert sample data into Notes table (escaped single quote)
INSERT INTO Notes (ContactID, NoteText)
VALUES (1, 'Met John at the conference.'),
       (1, 'Follow up regarding the project.'),
       (2, 'Alice''s birthday is next week.'), -- Escaped single quote
       (3, 'Bob is interested in the new product.');

-- Query to retrieve contacts along with their addresses and notes
SELECT 
    Contacts.ContactID, 
    FirstName, 
    LastName, 
    PhoneNumber, 
    EmailAddress, 
    StreetAddress, 
    City, 
    State, 
    PostalCode, 
    NoteText
FROM 
    Contacts
LEFT JOIN 
    Addresses ON Contacts.ContactID = Addresses.ContactID
LEFT JOIN 
    Notes ON Contacts.ContactID = Notes.ContactID;

SELECT * FROM Contacts;
