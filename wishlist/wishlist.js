
const wishlistTable = 'user1_wishlist';
const apiKey = 'patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3';
const baseId = 'appyj1ktTZGgXl2vP';
const apiUrl = `https://api.airtable.com/v0/${baseId}/${wishlistTable}`;

async function fetchWishlist() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();
    const container = document.getElementById('wishlist');
    container.innerHTML = '';

    if (!data.records.length) {
      container.innerHTML = '<p>No books in your wishlist.</p>';
      return;
    }

    data.records.forEach(record => {
      const book = record.fields;
      const recordId = record.id;

      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <img src="${book.Image?.[0]?.url || 'https://via.placeholder.com/200x240'}" alt="${book.BookName}" />
        <div class="book-title">${book.Bookname}</div>
        <button class="remove-btn">Remove</button>
      `;

      // View more info on click (card)
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) return; // skip if remove is clicked
        localStorage.setItem('selected_book', book.Bookname);
        window.location.href = '../info/info.html';
      });

      // Remove button logic
      card.querySelector('.remove-btn').addEventListener('click', async () => {
        const confirmRemove = confirm(`Remove "${book.Bookname}" from wishlist?`);
        if (!confirmRemove) return;

        try {
          const deleteUrl = `https://api.airtable.com/v0/${baseId}/${wishlistTable}/${recordId}`;
          const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          });

          if (deleteResponse.ok) {
            card.remove();
          } else {
            alert('Failed to remove book. Try again.');
          }
        } catch (err) {
          console.error('Error removing book:', err);
          alert('Error removing book.');
        }
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading wishlist:", error);
  }
}

window.onload = fetchWishlist;