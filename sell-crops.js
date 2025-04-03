document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-crop-btn').addEventListener('click', function(e) {
        e.preventDefault();

        const cropName = document.getElementById('crop-name').value;
        const cropImageInput = document.getElementById('crop-image');
        const cropImage = cropImageInput.files[0];
        const cropPrice = document.getElementById('crop-price').value;
        const cropQuantity = document.getElementById('crop-quantity').value;

        if (!cropName || !cropImage || !cropPrice || !cropQuantity) {
            alert('Please fill in all details');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            let loggedInUser = localStorage.getItem('loggedInUser');
            let currentUser = users.find(user => user.username === loggedInUser && user.userType === 'farmer');

            if (currentUser) {
                currentUser.crops.push({
                    name: cropName,
                    image: base64Image,
                    price: cropPrice,
                    quantity: cropQuantity
                });

                localStorage.setItem('users', JSON.stringify(users));
                alert('Crop details saved successfully!');
                window.location.href = 'farmer-dashboard.html'; // Redirect to dashboard
            } else {
                alert('User not found!');
            }
        };

        reader.readAsDataURL(cropImage);
    });

    document.getElementById('go-back-btn').addEventListener('click', function() {
        window.location.href = 'farmer-dashboard.html';
    });
});



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-crop-btn').addEventListener('click', function(e) {
        e.preventDefault();

        const cropName = document.getElementById('crop-name').value;
        const cropImageInput = document.getElementById('crop-image');
        const cropImage = cropImageInput.files[0];
        const cropPrice = document.getElementById('crop-price').value;
        const cropQuantity = document.getElementById('crop-quantity').value;

        if (!cropName || !cropImage || !cropPrice || !cropQuantity) {
            alert('Please fill in all details');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            let loggedInUser = localStorage.getItem('loggedInUser');
            let currentUser = users.find(user => user.username === loggedInUser && user.userType === 'farmer');

            if (currentUser) {
                currentUser.crops.push({
                    name: cropName,
                    image: base64Image,
                    price: cropPrice,
                    quantity: cropQuantity,
                    farmerName: currentUser.name || "Unknown Farmer",  // ✅ Store farmer's name
                    location: currentUser.location || "Unknown Location"  // ✅ Store farmer's location
                });

                localStorage.setItem('users', JSON.stringify(users));
                alert('Crop details saved successfully!');
                window.location.href = 'farmer-dashboard.html'; // Redirect to dashboard
            } else {
                alert('User not found!');
            }
        };

        reader.readAsDataURL(cropImage);
    });

    document.getElementById('go-back-btn').addEventListener('click', function() {
        window.location.href = 'farmer-dashboard.html';
    });
});
