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
    container.innerHTML = ''; // Clear existing content
    data.data.forEach(user => {
        const userElement = document.createElement('div');
        userElement.textContent = `User: ${user.first_name} ${user.last_name}`;
        container.appendChild(userElement);
    });
}

// Initial function call
fetchUsers();
