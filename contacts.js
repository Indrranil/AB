// JavaScript (contacts.js)
document.addEventListener('DOMContentLoaded', () => {
    const contactsList = document.getElementById('contactsList');
    const addContactBtn = document.getElementById('addContactBtn');

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:3000/contacts');
            const contacts = await response.json();

            contactsList.innerHTML = '';
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.FirstName} ${contact.LastName}</td>
                    <td>${contact.PhoneNumber}</td>
                    <td>${contact.EmailAddress}</td>
                    <td>
                        <button class="deleteBtn" data-id="${contact.ContactID}">Delete</button>
                        <button class="updateBtn" data-id="${contact.ContactID}">Update</button>
                    </td>
                `;

                // Add event listener for delete button
                const deleteBtn = row.querySelector('.deleteBtn');
                deleteBtn.addEventListener('click', async () => {
                    const contactId = deleteBtn.dataset.id;
                    try {
                        const response = await fetch(`http://localhost:3000/contacts/${contactId}`, {
                            method: 'DELETE'
                        });
                        const data = await response.json();
                        if (data.message === 'Contact deleted successfully') {
                            row.remove(); // Remove the row from the table upon successful deletion
                        }
                    } catch (error) {
                        console.error('Error deleting contact:', error);
                    }
                });

                // Add event listener for update button
                const updateBtn = row.querySelector('.updateBtn');
                updateBtn.addEventListener('click', () => {
                    const contactId = updateBtn.dataset.id;
                    // Implement update logic here
                    const updatedFirstName = prompt('Enter updated first name:');
                    const updatedLastName = prompt('Enter updated last name:');
                    const updatedPhoneNumber = prompt('Enter updated phone number:');
                    const updatedEmailAddress = prompt('Enter updated email address:');

                    // Validate inputs and send update request to the server
                    if (updatedFirstName && updatedLastName && updatedPhoneNumber && updatedEmailAddress) {
                        const updatedContact = {
                            firstName: updatedFirstName,
                            lastName: updatedLastName,
                            phoneNumber: updatedPhoneNumber,
                            emailAddress: updatedEmailAddress
                        };

                        // Send PUT request to update the contact
                        fetch(`http://localhost:3000/contacts/${contactId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedContact)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'Contact updated successfully') {
                                // Update the row with the updated contact details
                                row.innerHTML = `
                                    <td>${updatedContact.firstName} ${updatedContact.lastName}</td>
                                    <td>${updatedContact.phoneNumber}</td>
                                    <td>${updatedContact.emailAddress}</td>
                                    <td>
                                        <button class="deleteBtn" data-id="${contactId}">Delete</button>
                                        <button class="updateBtn" data-id="${contactId}">Update</button>
                                    </td>
                                `;
                            } else {
                                console.error('Error updating contact:', data.error);
                            }
                        })
                        .catch(error => {
                            console.error('Error updating contact:', error);
                        });
                    } else {
                        alert('Invalid input. Please provide all contact details.');
                    }
                });

                contactsList.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // Event listener for "Add Contact" button
    addContactBtn.addEventListener('click', async () => {
        const firstName = prompt('Enter first name:');
        const lastName = prompt('Enter last name:');
        const phoneNumber = prompt('Enter phone number:');
        const emailAddress = prompt('Enter email address:');

        if (firstName && lastName && phoneNumber && emailAddress) {
            const newContact = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                emailAddress: emailAddress
            };

            try {
                const response = await fetch('http://localhost:3000/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newContact)
                });
                const data = await response.json();

                if (response.ok) {
                    // Contact added successfully, fetch and display updated contacts
                    fetchContacts();
                } else {
                    console.error('Error adding contact:', data.error);
                }
            } catch (error) {
                console.error('Error adding contact:', error);
            }
        } else {
            alert('Invalid input. Please provide all contact details.');
        }
    });

    // Fetch contacts when the page loads
    fetchContacts();
});
