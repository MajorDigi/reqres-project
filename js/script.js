let currentPage = 1;
const usersPerPage = 5;
let totalUsers = 0;

async function fetchUsers(page = 1, sortBy = 'name') {
    console.log('Fetching user data...'); // Log when fetching starts
    try {
        const response = await fetch(`https://reqres.in/api/users?page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        totalUsers = data.total;
        console.log('Fetched data:', data); // Log the fetched data
        displayUsers(data, sortBy);
    } catch (error) {
        console.error('Error fetching user data:', error); // Log errors
    }
}

function displayUsers(data, sortBy) {
    const container = document.getElementById('user-container');
    if (container) { // Ensure container exists
        container.innerHTML = ''; // Clear existing content
        const sortedUsers = sortUsers(data.data, sortBy);
        sortedUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = `User: ${user.first_name} ${user.last_name}`;
            userElement.style.cursor = 'pointer';
            userElement.addEventListener('click', () => displayUserDetails(user));
            container.appendChild(userElement);
        });
    } else {
        console.error('Element with ID "user-container" not found');
    }
}

function sortUsers(users, sortBy) {
    return users.sort((a, b) => {
        if (sortBy === 'name') {
            return a.first_name.localeCompare(b.first_name);
        } else {
            return a.email.localeCompare(b.email);
        }
    });
}

// Pagination controls
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers(currentPage, document.getElementById('sort-select').value);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage * usersPerPage < totalUsers) {
        currentPage++;
        fetchUsers(currentPage, document.getElementById('sort-select').value);
    }
});

// Sorting
document.getElementById('sort-select').addEventListener('change', (event) => {
    fetchUsers(currentPage, event.target.value);
});

// Display user details
function displayUserDetails(user) {
    alert(`User Details:\nName: ${user.first_name} ${user.last_name}\nEmail: ${user.email}`);
}

// Function to handle the form submission for creating a new user
document.getElementById('create-user-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!firstName || !lastName || !email) {
        console.error('Form inputs are missing or invalid');
        document.getElementById('create-user-response').innerText = 'Error: Missing form input';
        return;
    }

    if (!validateEmail(email)) {
        console.error('Invalid email address');
        document.getElementById('create-user-response').innerText = 'Error: Invalid email address';
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
        fetchUsers(currentPage);
    } catch (error) {
        console.error('Error creating user:', error);
        document.getElementById('create-user-response').innerText = 'Error creating user';
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Initial function call
fetchUsers(currentPage);
