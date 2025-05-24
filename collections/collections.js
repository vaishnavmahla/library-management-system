
const apiKey = 'patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3';//'pataDwESaLgKHWjZS.89ff558d1e8d4e52a6b50b39b04f7cfd9f6dece99e638a31767165b96f97c142';
const baseId = 'apprASVvVsagybiJS';
const tableName = 'TableMain';
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

async function fetchAllBooks() {
  let allRecords = [];
  let offset = null;
  const viewName = 'Grid view'; // Replace with your Airtable view name

  try {
    do {
      let url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=100&view=${encodeURIComponent(viewName)}`;
      if (offset) url += `&offset=${offset}`;

      const response = await fetch(url, { headers });
      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    displayBooks(allRecords);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}


function displayBooks(records) {
  const container = document.getElementById('gallery-container');
  container.innerHTML = '';
  records.forEach(record => {
    const book = record.fields["Book"] || 'Untitled';
    const author = record.fields["Author"] || 'Unknown Author';
    const type = record.fields["Type"] || 'Unknown';
    const rating = record.fields["Rating"] || 0;

    // Adjust field name if your Airtable field is not "image"
    const imageAttachment = record.fields["image"];
    const imageUrl = Array.isArray(imageAttachment) ? imageAttachment[0].url : '';

    const card = document.createElement('div');
    card.className = 'card';

    const starElements = generateStars(rating);

    const fallbackImage = "fallback.jpg";
    const imageHtml = `<img src="${imageUrl || fallbackImage}" alt="${book}" onerror="this.onerror=null; this.src='${fallbackImage}';">`;

    card.innerHTML = `
      ${imageHtml}
      <h3>${book}</h3>
      <div class="author">${author}</div>
      <div class="type">${type}</div>
      <div class="stars">${starElements}</div>
      <button class="book-btn" onclick="document.getElementBy">View Details</button>
    `;
    const button = card.querySelector('.book-btn');
    button.addEventListener('click', () => {
      localStorage.setItem('selectedBookName', book); // Save book name
      window.location.href = "../info/info.html"; // Redirect
    });

    container.appendChild(card);
  });
}


function generateStars(rating) {
  const maxStars = 5;
  let starsHTML = '';
  for (let i = 1; i <= maxStars; i++) {
    starsHTML += `<span class="star ${i <= rating ? '' : 'gray'}">&#9733;</span>`;
  }
  return starsHTML;
}

fetchAllBooks();