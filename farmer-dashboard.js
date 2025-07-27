document.addEventListener('DOMContentLoaded', function () {
  const cropsTbody = document.getElementById('crops-tbody');
  const addCropsBtn = document.getElementById('add-crops-btn');
  const msgDiv = document.getElementById('dashboard-message');

  function showMessage(message, isError = false) {
    msgDiv.textContent = message;
    msgDiv.className = isError ? 'error' : 'success';
    setTimeout(() => {
      msgDiv.textContent = '';
      msgDiv.className = '';
    }, 3000);
  }

  function renderTable(crops) {
    cropsTbody.innerHTML = '';

    if (!crops.length) {
      cropsTbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No crops added yet.</td></tr>';
      return;
    }

    crops.forEach(crop => {
      const aiRating = crop.ai_rating || '-';
      const imgSrc = crop.image_filename
        ? `http://localhost:5000/uploads/${crop.image_filename}`
        : 'placeholder.jpg';

      const farmerName = crop.farmer_name || 'N/A';
      const farmerMobile = crop.farmer_mobile || '';
      const location = crop.location || 'N/A';

      const row = document.createElement('tr');
      row.innerHTML = `
  <td>${farmerName}</td>
  <td>${crop.name}</td>
  <td><img src="${imgSrc}" alt="${crop.name}" width="60" height="60" ...></td>
  <td>₹${Number(crop.price).toFixed(2)}</td>
  <td>${aiRating}</td>
  <td>${crop.quantity}</td>
  <td>${farmerMobile}</td>
  <td>${location}</td>
  <td>${new Date(crop.added_at).toLocaleString()}</td>
  <td>
    <button class="delete-btn" data-cropid="${crop.id}" aria-label="Delete ${crop.name}">🗑️</button>
    </td>      `
    ;
      cropsTbody.appendChild(row);
    });
  }

  async function loadCrops() {
    try {
      const response = await fetch('http://localhost:5000/list_crops');
      if (!response.ok) {
        throw new Error('Failed to fetch crops');
      }
      const crops = await response.json();
      renderTable(crops);
      showMessage('Crops loaded successfully.');
    } catch (error) {
      showMessage(`Error loading crops: ${error.message}`, true);
      renderTable([]);
    }
  }

  async function deleteCrop(cropId) {
    if (!confirm('Are you sure you want to delete this crop?')) return;
    try {
      const response = await fetch(`http://localhost:5000/delete_crop/${cropId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        showMessage('Crop deleted successfully.');
        loadCrops();
      } else {
        throw new Error(result.message || 'Failed to delete crop.');
      }
    } catch (error) {
      showMessage(`Error: ${error.message}`, true);
    }
  }

  // Handle clicks for delete buttons only
  cropsTbody.addEventListener('click', (event) => {
    const target = event.target;

    // Delete button click
    if (target.classList.contains('delete-btn')) {
      const cropId = target.getAttribute('data-cropid');
      if (cropId) {
        deleteCrop(cropId);
      }
    }
  });

  // Navigate to Add Crop page
  addCropsBtn.addEventListener('click', () => {
    window.location.href = 'sell-crops.html';
  });

  // Initial load
  loadCrops();
});
