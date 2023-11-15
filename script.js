document.addEventListener('DOMContentLoaded', () => {
    const contactsList = document.getElementById('contactsList');

    // Function to fetch and display contacts
    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:3000/contacts');
            const contacts = await response.json();

            contactsList.innerHTML = '';
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.firstName} ${contact.lastName}</td>
                    <td>${contact.phoneNumber}</td>
                    <td>${contact.emailAddress}</td>
                    <td>
                        <button class="deleteBtn" data-id="${contact.contactId}">Delete</button>
                        <button class="updateBtn" data-id="${contact.contactId}">Update</button>
                    </td>
                `;

                // Add event listener for delete button
                const deleteBtn = row.querySelector('.deleteBtn');
                deleteBtn.addEventListener('click', async () => {
                    const contactId = deleteBtn.dataset.id;
                    // Implement delete logic here
                });

                // Add event listener for update button
                const updateBtn = row.querySelector('.updateBtn');
                updateBtn.addEventListener('click', () => {
                    const contactId = updateBtn.dataset.id;
                    // Implement update logic here
                });

                contactsList.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // Fetch contacts when the page loads
    fetchContacts();
});
