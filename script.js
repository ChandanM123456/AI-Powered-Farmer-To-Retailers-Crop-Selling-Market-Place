let userType = ''; // Variable to store user type
let currentUser = null; // Track the logged-in user

document.addEventListener('DOMContentLoaded', function () {
    // Event listener for "Continue as Farmer" button
    document.getElementById('continue-as-farmer').addEventListener('click', function () {
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('registration-user-type').innerText = 'Farmer Registration';
        userType = 'farmer'; // Set user type to farmer
    });

    // Event listener for "Continue as Retailer" button
    document.getElementById('continue-as-retailer').addEventListener('click', function () {
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('registration-user-type').innerText = 'Retailer Registration';
        userType = 'retailer'; // Set user type to retailer
    });

    // Event listener for "Go to Register" link
    document.getElementById('go-to-register').addEventListener('click', function () {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('registration-page').style.display = 'block';
    });

    // Event listener for "Go to Login from Register" link
    document.getElementById('go-to-login-from-register').addEventListener('click', function () {
        document.getElementById('registration-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    });

    // Event listener for "Register" button
    document.getElementById('register-btn').addEventListener('click', function (e) {
        e.preventDefault();

        const regUsername = document.getElementById('reg-username').value;
        const regMobile = document.getElementById('reg-mobile').value;
        const regPassword = document.getElementById('reg-password').value;
        const regConfirmPassword = document.getElementById('reg-confirm-password').value;

        if (regPassword !== regConfirmPassword) {
            alert("Passwords do not match");
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if a user with the same username and userType already exists
        const existingUser = users.find(user => user.username === regUsername && user.userType === userType);
        
        if (existingUser) {
            alert(`User with username "${regUsername}" already registered as ${userType}.`);
            return;
        }

        const newUser = {
            username: regUsername,
            mobile: regMobile,
            password: regPassword,
            userType: userType,
            crops: [] // Initialize crops array for farmer
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert(`Successfully registered as ${userType}.`);

        // Redirect to login page
        document.getElementById('registration-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    });

    // Event listener for "Login" button
    document.getElementById('login-btn').addEventListener('click', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const mobile = document.getElementById('mobile').value;
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u =>
            u.username === username &&
            u.mobile === mobile &&
            u.password === password &&
            u.userType === userType
        );

        if (user) {
            currentUser = user; // Set the current logged-in user
            localStorage.setItem('loggedInUser', username); // Save logged-in username

            alert(`Successfully logged in as ${user.userType}.`);

            if (user.userType === 'farmer') {
                window.location.href = 'farmer-dashboard.html'; // Redirect to farmer dashboard
            } else if (user.userType === 'retailer') {
                window.location.href = 'retailer-dashboard.html'; // Redirect to retailer dashboard
            }

            document.getElementById('login-page').style.display = 'none'; // Hide login page

        } else {
            alert(`Invalid login credentials or you are not registered as ${userType}.`);
        }
    });

    // Event listener for "Login Icon"
    document.getElementById('login-icon').addEventListener('click', function () {
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    });
});
