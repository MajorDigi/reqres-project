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

// Function to handle the form submission for creating a new user
document.getElementById('create-user-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const firstName = document.getElementById('first-name') ? document.getElementById('first-name').value : '';
    const lastName = document.getElementById('last-name') ? document.getElementById('last-name').value : '';
    const email = document.getElementById('email') ? document.getElementById('email').value : '';

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
    // Implement the logic to open a modal or prompt for user update details
    console.log(`Handle update for user with ID: ${userId}`);
}

// Initial function call
fetchUsers();
