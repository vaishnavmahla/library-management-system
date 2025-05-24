const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const booksContainer = document.getElementById('books-container');
const filterBtn = document.querySelector('.filter-btn');
const topPicksContainer = document.getElementById('top-picks');
const weeklyBestContainer = document.getElementById('weekly-best');
const readersChoiceContainer = document.getElementById('readers-choice');
const newArrivalsContainer = document.getElementById('new-arrivals');

const apiKey = 'patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3';//'pat60QgeeuIhG1ybT.b58c36205d121a0dc28364cd086fd8a7da21e2ea24fce99b0a810be51a43f2eb';
const baseId = 'apprASVvVsagybiJS';
const tableName = 'TableMain';



async function fetchAllBooks(limit = 20) {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=${limit}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const data = await response.json();
  return data.records.map(record => ({
    title: record.fields.Book || 'Untitled',
    author: record.fields.Author || 'Unknown',
    image: record.fields.image?.[0]?.url || 'book.jpg'
  }));
}

async function fillRandomBooks(container, count) {
  const books = await fetchAllBooks(30);
  const shuffled = books.sort(() => 0.5 - Math.random()).slice(0, count);
  container.innerHTML = '';
  shuffled.forEach(book => container.appendChild(createBookCard(book)))

}



async function searchBooks(query, field) {
  const formula = `FIND(LOWER(\"${query}\"), LOWER({${field}}))`;
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(formula)}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const data = await response.json();
    const records = data.records.map(record => ({
      title: record.fields.Book || 'Untitled',
      author: record.fields.Author || 'Unknown',
      image: record.fields.image?.[0]?.url || 'book.jpg'
    }));
    displaySearchResults(records);
  } catch (err) {
    console.error(err);
    booksContainer.innerHTML = '<p>Error loading results.</p>';
  }
}

function displaySearchResults(books) {
  booksContainer.innerHTML = '';
  if (books.length === 0) {
    booksContainer.innerHTML = '<p>No books found.</p>';
    return;
  }
  books.forEach(book => booksContainer.appendChild(createBookCard(book)));
}

function createBookCard(book) {
const card = document.createElement('div');
card.className = 'book-card';
card.innerHTML = `
<img src="${book.image}" alt="${book.title}" />
<h3>${book.title}</h3>
<p>${book.author}</p>
`;

card.addEventListener('click', () => {
localStorage.setItem('selectedBookName', book.title);
window.location.href = '../info/info.html';
});

return card;
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filter = document.querySelector('input[name="filter"]:checked').value;
  if (query) {
    searchResults.style.display = 'flex';
    searchBooks(query, filter);
  } else {
    searchResults.style.display = 'none';
    booksContainer.innerHTML = '';
  }
});

filterBtn.addEventListener('click', () => {
  searchResults.style.display = searchResults.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !filterBtn.contains(e.target)) {
    searchResults.style.display = 'none';
  }
});

fillRandomBooks(topPicksContainer, 8);
fillRandomBooks(weeklyBestContainer, 8);
fillRandomBooks(readersChoiceContainer, 8);
fillRandomBooks(newArrivalsContainer, 8);