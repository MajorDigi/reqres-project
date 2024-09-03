// Variables to manage pagination
let currentPage = 1;
const usersPerPage = 5;
let usersData = [];

// Function to fetch user data from Reqres API
async function fetchUsers(page = 1, sortBy = 'first_name') {
    console.log('Fetching user data...'); // Log when fetching starts
    try {
        const response = await fetch(`https://reqres.in/api/users?page=${page}&per_page=${usersPerPage}&sort_by=${sortBy}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        usersData = data.data; // Store fetched data
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
            userElement.classList.add('user-item');
            userElement.innerHTML = `
                <p>User: ${user.first_name} ${user.last_name}</p>
                <button class="view-details" data-id="${user.id}">View Details</button>
            `;
            container.appendChild(userElement);
        });

        // Add event listeners for view details buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', () => {
                const userId = button.getAttribute('data-id');
                const user = usersData.find(u => u.id == userId);
                showUserDetails(user);
            });
        });
    } else {
        console.error('Element with ID "user-container" not found');
    }
}

// Function to show user details in a modal
function showUserDetails(user) {
    const modal = document.getElementById('user-details-modal');
    const userDetails = document.getElementById('user-details');
    const closeModal = document.querySelector('#user-details-modal .close');
    
    userDetails.innerHTML = `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>First Name:</strong> ${user.first_name}</p>
        <p><strong>Last Name:</strong> ${user.last_name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Avatar:</strong> <img src="${user.avatar}" alt="${user.first_name}'s avatar" width="100"></p>
    `;
    modal.style.display = 'block';

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Handle form submission for creating a new user
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
        fetchUsers(currentPage);
    } catch (error) {
        console.error('Error creating user:', error);
        document.getElementById('create-user-response').innerText = 'Error creating user';
    }
});

// Handle pagination
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchUsers(currentPage);
});

// Handle sorting
document.getElementById('sort-select').addEventListener('change', (event) => {
    const sortBy = event.target.value;
    fetchUsers(currentPage, sortBy);
});

// Initial function call
fetchUsers(currentPage);

