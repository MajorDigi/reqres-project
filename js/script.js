// Fetch and display users
async function fetchUsers() {
    try {
        const response = await fetch('https://reqres.in/api/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayUsers(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Display users in the user container
function displayUsers(data) {
    const container = document.getElementById('user-container');
    if (container) {
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
            userElement.innerHTML = `
                User: ${user.first_name} ${user.last_name}
                <button class="delete-btn" data-id="${user.id}">Delete</button>
                <button class="update-btn" data-id="${user.id}">Update</button>
                <button class="view-profile-btn" data-id="${user.id}">View Profile</button>
            `;
            container.appendChild(userElement);
        });

        // Add event listeners for buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteUser);
        });
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', handleUpdateUserButton);
        });
        addProfileButtons();
    } else {
        console.error('Element with ID "user-container" not found');
    }
}

// Handle create user form submission
document.getElementById('create-user-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const firstName = document.getElementById('first-name') ? document.getElementById('first-name').value : '';
    const lastName = document.getElementById('last-name') ? document.getElementById('last-name').value : '';
    const email = document.getElementById('email') ? document.getElementById('email').value : '';

    if (!firstName || !lastName || !email) {
        console.error('Form inputs are missing or invalid');
        alert('Please fill out all fields correctly.');
        return;
    }

    if (!validateEmail(email)) {
        console.error('Invalid email format');
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email })
        });

        if (response.ok) {
            console.log('User created successfully');
            document.getElementById('create-user-response').textContent = 'User created successfully!';
            fetchUsers(); // Refresh the user list
            document.getElementById('create-user-form').reset();
        } else {
            throw new Error('Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
});

// Function to handle user profile viewing
async function fetchUserProfile(userId) {
    console.log('Fetching user profile for ID:', userId); // Log when fetching starts
    try {
        const response = await fetch(`https://reqres.in/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched user profile:', data); // Log the fetched data
        displayUserProfile(data);
    } catch (error) {
        console.error('Error fetching user profile:', error); // Log errors
    }
}

// Function to display user profile on the page
function displayUserProfile(data) {
    const container = document.getElementById('profile-container');
    if (container) { // Ensure container exists
        container.innerHTML = `
            <h3>${data.data.first_name} ${data.data.last_name}</h3>
            <p>Email: ${data.data.email}</p>
            <p>Job: ${data.data.job}</p>
            <img src="${data.data.avatar}" alt="User Avatar" style="width: 100px; height: 100px;">
        `;
    } else {
        console.error('Element with ID "profile-container" not found');
    }
}

// Add event listeners for "View Profile" buttons
function addProfileButtons() {
    document.querySelectorAll('.view-profile-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.getAttribute('data-id');
            fetchUserProfile(userId);
        });
    });
}

// Function to handle user deletion
async function handleDeleteUser(event) {
    const userId = event.target.getAttribute('data-id');
    try {
        const response = await fetch(`https://reqres.in/api/users/${userId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log(`User with ID ${userId} deleted`);
            fetchUsers(); // Refresh the user list
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Function to handle user update
function handleUpdateUserButton(event) {
    const userId = event.target.getAttribute('data-id');
    showUpdateForm(userId); // Show the update form
}

// Show the update form with user data
async function showUpdateForm(userId) {
    const response = await fetch(`https://reqres.in/api/users/${userId}`);
    const data = await response.json();

    document.getElementById('update-first-name').value = data.data.first_name;
    document.getElementById('update-last-name').value = data.data.last_name;
    document.getElementById('update-email').value = data.data.email;
    document.getElementById('update-user-id').value = userId;
    document.getElementById('update-user-form').style.display = 'block';
}

// Handle update form submission
document.getElementById('update-user-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const userId = document.getElementById('update-user-id').value;
    const firstName = document.getElementById('update-first-name').value;
    const lastName = document.getElementById('update-last-name').value;
    const email = document.getElementById('update-email').value;

    try {
        const response = await fetch(`https://reqres.in/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email })
        });

        if (response.ok) {
            console.log('User updated successfully');
            document.getElementById('update-user-response').textContent = 'User updated successfully!';
            fetchUsers(); // Refresh the user list
            document.getElementById('update-user-form').reset();
            document.getElementById('update-user-form').style.display = 'none';
        } else {
            throw new Error('Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
});

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initial function call
fetchUsers();
