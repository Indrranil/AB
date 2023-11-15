const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

console.log('Connecting to database with settings:', {
  host: 'localhost',
  user: 'root',
  password: 'Indrranil@24',
  database: 'AddressBookDB',
});

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Indrranil@24',
  database: 'AddressBookDB',
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

// POST create contact
app.post('/contacts', (req, res) => {
  const { firstName, lastName, phoneNumber, emailAddress, address } = req.body;

  pool.query(
    'INSERT INTO Contacts (FirstName, LastName, PhoneNumber, EmailAddress, Address) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, phoneNumber, emailAddress, address],
    (error, result) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const contactId = result.insertId;
        res.json({ message: 'Contact added successfully', contactId });
      }
    }
  );
});

// GET all contacts
app.get('/contacts', (req, res) => {
  pool.query('SELECT Contacts.*, Addresses.StreetAddress, Addresses.City, Addresses.State, Addresses.PostalCode FROM Contacts LEFT JOIN Addresses ON Contacts.ContactID = Addresses.ContactID', (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

// GET contact by ID
app.get('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  pool.query('SELECT Contacts.*, Addresses.StreetAddress, Addresses.City, Addresses.State, Addresses.PostalCode FROM Contacts LEFT JOIN Addresses ON Contacts.ContactID = Addresses.ContactID WHERE Contacts.ContactID = ?', [contactId], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results[0]);
    }
  });
});

// PUT update contact by ID
app.put('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  const { firstName, lastName, phoneNumber, emailAddress, address } = req.body;

  pool.query(
    'UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, EmailAddress=? WHERE ContactID=?',
    [firstName, lastName, phoneNumber, emailAddress, contactId],
    (error) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        pool.query(
          'UPDATE Addresses SET StreetAddress=?, City=?, State=?, PostalCode=? WHERE ContactID=?',
          [address.streetAddress, address.city, address.state, address.postalCode, contactId],
          (error) => {
            if (error) {
              console.error('Error executing query: ', error);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.json({ message: 'Contact updated successfully' });
            }
          }
        );
      }
    }
  );
});

// DELETE contact by ID
app.delete('/contacts/:id', (req, res) => {
  const contactId = req.params.id;

  if (!contactId || isNaN(contactId)) {
    res.status(400).json({ error: 'Invalid contact ID' });
    return;
  }

  pool.query(
    'DELETE Contacts, Addresses FROM Contacts LEFT JOIN Addresses ON Contacts.ContactID = Addresses.ContactID WHERE Contacts.ContactID = ?',
    [contactId],
    (error) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'Contact deleted successfully' });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
