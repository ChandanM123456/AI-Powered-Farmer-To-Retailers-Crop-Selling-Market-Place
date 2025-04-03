document.addEventListener('DOMContentLoaded', function() {
    const cropsTbody = document.getElementById('crops-tbody');

    function loadCrops() {
        let crops = [];
        let users = JSON.parse(localStorage.getItem('users')) || [];

        users.forEach(user => {
            if (user.userType === 'farmer' && user.crops && Array.isArray(user.crops)) {
                user.crops.forEach(crop => {
                    crops.push({
                        name: crop.name || "Unknown",
                        image: crop.image || 'placeholder.jpg',
                        price: crop.price || 0,
                        aiRating: crop.aiRating || "N/A",
                        aiDemand: crop.aiDemand || "N/A",
                        quantity: crop.quantity || "N/A",
                        farmerName: crop.farmerName || user.name ,  // ✅ Retrieve farmer's name correctly
                        farmerMobile: user.mobile || "N/A",
                        location: crop.location || user.location   // ✅ Retrieve farmer's location correctly
                    });
                });
            }
        });

        cropsTbody.innerHTML = '';

        if (crops.length === 0) {
            cropsTbody.innerHTML = '<tr><td colspan="9">No crops available.</td></tr>';
        }

        crops.forEach(crop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crop.name}</td>
                <td><img src="${crop.image}" alt="${crop.name}" width="50"></td>
                <td>₹${crop.price}</td>
                <td>${crop.aiRating}/5</td>
                <td>${crop.aiDemand}%</td>
                <td>${crop.farmerName}</td>
                <td>${crop.location}</td>
                <td>${crop.quantity}</td>
                <td>
                    <button class="connect-btn" data-phone="${crop.farmerMobile}" data-name="${crop.farmerName}">
                        Connect to Farmer
                    </button>
                </td>
            `;

            row.querySelector('.connect-btn').addEventListener('click', function() {
                const phoneNumber = this.dataset.phone;
                const farmerName = this.dataset.name;
                if (phoneNumber === "N/A") {
                    alert(`No contact information available for ${farmerName}.`);
                } else {
                    window.location.href = `tel:+91${phoneNumber}`;
                }
            });

            cropsTbody.appendChild(row);
        });
    }

    loadCrops();
});
