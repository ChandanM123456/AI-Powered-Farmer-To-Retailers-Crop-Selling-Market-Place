document.addEventListener('DOMContentLoaded', function () {
    const sellCropsForm = document.getElementById('sell-crops-form');
    const goBackBtn = document.getElementById('go-back-btn');

    if (sellCropsForm) {
        sellCropsForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const farmerName = document.getElementById('farmer-name').value.trim();
            const farmerMobile = document.getElementById('farmer-mobile').value.trim();
            const farmerLocation = document.getElementById('farmer-location').value.trim();

            const cropName = document.getElementById('crop-name').value.trim();
            const cropImageInput = document.getElementById('crop-image');
            const cropImage = cropImageInput.files[0];
            const cropPrice = document.getElementById('crop-price').value.trim();
            const cropQuantity = document.getElementById('crop-quantity').value.trim();

            // Validate all required fields including farmer details
            if (!farmerName || !farmerMobile || !farmerLocation || !cropName || !cropImage || !cropPrice || !cropQuantity) {
                alert('❗ Please fill in all required details and upload an image.');
                return;
            }

            // Optional: Validate mobile number (10-digit Indian mobile)
            if (!/^\d{10}$/.test(farmerMobile)) {
                alert('❗ Please enter a valid 10-digit mobile number.');
                return;
            }

            const formData = new FormData();
            formData.append('farmer_name', farmerName);
            formData.append('farmer_mobile', farmerMobile);
            formData.append('location', farmerLocation);

            formData.append('name', cropName);
            formData.append('price', cropPrice);
            formData.append('quantity', cropQuantity);
            formData.append('image', cropImage);

            fetch('http://localhost:5000/upload_crop', {
                method: 'POST',
                body: formData
            })
            .then(resp => resp.json())
            .then(data => {
                if (!data.success) {
                    alert('❌ Failed to save crop in database: ' + data.message);
                    return;
                }
                alert(`✅ Crop added! AI Rating: ${data.aiRating || '-'}`);
                window.location.href = 'farmer-dashboard.html';
            })
            .catch(err => {
                alert('❌ Error saving crop in database: ' + err);
                window.location.href = 'farmer-dashboard.html';
            });
        });
    }

    if (goBackBtn) {
        goBackBtn.addEventListener('click', function () {
            window.location.href = 'farmer-dashboard.html';
        });
    }
});
