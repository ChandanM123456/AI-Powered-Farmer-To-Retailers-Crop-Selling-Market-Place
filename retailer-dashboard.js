document.addEventListener('DOMContentLoaded', () => {
  const cropsTbody = document.getElementById('crops-tbody');
  const messageDiv = document.getElementById('message');

  function safeText(text, fallback = '-') {
    if (
      text === null ||
      text === undefined ||
      text === '' ||
      (typeof text === 'string' && ['n/a', 'na', 'null', 'undefined'].includes(text.trim().toLowerCase()))
    ) {
      return fallback;
    }
    return text;
  }

  function displayLocation(text) {
    if (
      text === null ||
      text === undefined ||
      text === '' ||
      (typeof text === 'string' && ['n/a', 'na', 'null', 'undefined'].includes(text.trim().toLowerCase()))
    ) {
      return '';
    }
    return text;
  }

  function getImageUrl(filename) {
    if (!filename) return 'placeholder.jpg'; // Change to your placeholder image path if needed
    return `http://localhost:5000/uploads/${filename}`;
  }

  function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? 'red' : 'green';
    setTimeout(() => {
      messageDiv.textContent = '';
    }, 3000);
  }

  async function loadCropsFromDB() {
    try {
      showMessage('Loading crop details...');
      const response = await fetch('http://localhost:5000/list_crops');
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const crops = await response.json();

      renderTable(crops);
      showMessage(`Loaded ${crops.length} crop${crops.length !== 1 ? 's' : ''}.`);
    } catch (error) {
      showMessage(`Error loading crops: ${error.message}`, true);
      const colspanCount = 8; // Number of columns after removing Market Demand
      cropsTbody.innerHTML = `<tr><td colspan="${colspanCount}" style="text-align:center; color:red;">Failed to load crops data.</td></tr>`;
    }
  }

  function renderTable(crops) {
    cropsTbody.innerHTML = '';

    if (!crops.length) {
      const colspanCount = 8; // Number of columns after removing Market Demand
      cropsTbody.innerHTML = `<tr><td colspan="${colspanCount}" style="text-align:center;">No crops available.</td></tr>`;
      return;
    }

    crops.forEach(crop => {
      const row = document.createElement('tr');

      const farmerName = safeText(crop.farmer_name, 'Unknown Farmer');
      // Removed marketDemand
      const aiRating = safeText(crop.ai_rating, 'N/A');
      const location = displayLocation(crop.location);
      const quantity = safeText(crop.quantity, '-');
      const cropName = safeText(crop.name, '-');
      const price = (crop.price !== undefined && crop.price !== null)
        ? Number(crop.price).toFixed(2)
        : '-';
      const imgUrl = getImageUrl(crop.image_filename);

      row.innerHTML = `
        <td>${farmerName}</td>
        <td>${cropName}</td>
        <td>
          <img src="${imgUrl}" alt="Image of ${cropName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
        </td>
        <td>₹${price}</td>
        <td>${aiRating}</td>
        <td>${location}</td>
        <td>${quantity}</td>
        <td>
          <button class="connect-btn" data-phone="${crop.farmer_mobile || ''}" data-name="${farmerName}">
            Connect to Farmer
          </button>
        </td>
      `;

      row.querySelector('.connect-btn').addEventListener('click', function() {
        const phoneNumber = this.dataset.phone;
        const farmerNameClicked = this.dataset.name;
        if (!phoneNumber) {
          alert(`No contact information available for ${farmerNameClicked}.`);
        } else {
          window.location.href = `tel:+91${phoneNumber}`;
        }
      });

      cropsTbody.appendChild(row);
    });
  }

  loadCropsFromDB();
});
