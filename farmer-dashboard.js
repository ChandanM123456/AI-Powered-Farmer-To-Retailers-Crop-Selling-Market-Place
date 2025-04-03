document.addEventListener('DOMContentLoaded', function () {
    const cropsTbody = document.getElementById('crops-tbody');

    function getRandomRating() {
        return (Math.random() * (5 - 3) + 3).toFixed(1); // Generates rating between 3.0 and 5.0
    }

    function getRandomDemand() {
        return (Math.random() * (50 - (-30)) + (-30)).toFixed(1); // Generates % change between -30% and +50%
    }

    function loadCrops() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let loggedInUser = localStorage.getItem('loggedInUser');
        let currentUser = users.find(user => user.username === loggedInUser && user.userType === 'farmer');

        cropsTbody.innerHTML = '';

        if (currentUser && currentUser.crops && currentUser.crops.length > 0) {
            currentUser.crops.forEach((crop, index) => {
                if (!crop.aiRating) crop.aiRating = getRandomRating();
                if (!crop.aiDemand) crop.aiDemand = getRandomDemand();

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${crop.name}</td>
                    <td><img src="${crop.image || 'placeholder.jpg'}" alt="${crop.name}" width="50"></td>
                    <td>₹${crop.price}</td>
                    <td>${crop.aiRating}/5</td>
                    <td>${crop.aiDemand}%</td>
                    <td>${crop.quantity}</td>
                    <td>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </td>
                `;
                cropsTbody.appendChild(row);
            });

            localStorage.setItem('users', JSON.stringify(users)); // Store updates
        } else {
            cropsTbody.innerHTML = '<tr><td colspan="7">No crops added yet.</td></tr>';
        }
    }

    function deleteCrop(index) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let loggedInUser = localStorage.getItem('loggedInUser');
        let currentUser = users.find(user => user.username === loggedInUser && user.userType === 'farmer');

        if (currentUser && currentUser.crops) {
            currentUser.crops.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            loadCrops(); // Reload crops after deletion
        }
    }

    cropsTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) deleteCrop(e.target.dataset.index);
    });

    document.getElementById('add-crops-btn').addEventListener('click', () => {
        window.location.href = 'sell-crops.html';
    });

    loadCrops(); // Load crops every time the dashboard is visited
});
