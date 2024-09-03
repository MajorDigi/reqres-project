// Function to fetch user data from Reqres API
async function fetchUsers() {
    console.log('Fetching user data...'); // Log when fetching starts
    try {
        const response = await fetch('https://reqres.in/api/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        displayUsers(data);
    } catch (error) {
        console.error('Error fetching user data:', error); // Log errors
    }
}

// Function to display users on the page
function displayUsers(data) {
    const container = document.getElementById('user-container');
    if (container) { // Ensure container exists
        container.innerHTML = ''; // Clear existing content
        data.data.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = `User: ${user.first_name} ${user.last_name}`;
            
            // Add delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(`https://reqres.in/api/users/${user.id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        console.log('User deleted:', user.id);
                        fetchUsers(); // Refresh user list
                    } else {
                        console.error('Failed to delete user:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            });

            userElement.appendChild(deleteButton);
            container.appendChild(userElement);
        });
    } else {
        console.error('Element with ID "user-container" not found');
    }
}

// Function to handle the form submission for creating a new user
document.getElementById('create-user-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;

    if (!firstName || !lastName || !email) {
        console.error('Form inputs are missing or invalid');
        document.getElementById('create-user-response').innerText = 'Error: Missing form input';
        return;
    }

    try {
        // Make POST request to Reqres API
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: `${firstName} ${lastName}`, job: email }), // Adjusted to match the API structure
        });

        const data = await response.json();
        console.log('User created:', data);

        // Display response in the HTML
        document.getElementById('create-user-response').innerText = `User created with ID: ${data.id}`;

        // Optionally, fetch and display users again after creating a new one
        fetchUsers();
    } catch (error) {
        console.error('Error creating user:', error);
        document.getElementById('create-user-response').innerText = 'Error creating user';
    }
});

// Initial function call
fetchUsers();
