
const userairtableApiKey = 'patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3';
const publicairtableApiKey = 'patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3';//'pataDwESaLgKHWjZS.89ff558d1e8d4e52a6b50b39b04f7cfd9f6dece99e638a31767165b96f97c142';
const userBaseId = 'appyj1ktTZGgXl2vP';
const publicBaseId = 'apprASVvVsagybiJS'
const tableName = 'TableMain';
//const mainTable = 'TableMain';


async function getSelectedBookName() {
  return localStorage.getItem('selectedBookName');
}

async function fetchBooks() {
  const selectedBookName = await getSelectedBookName();
  if (!selectedBookName) {
    alert('No book name found in local storage');
    return;
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/${publicBaseId}/${tableName}?filterByFormula={Book}='${selectedBookName}'`, {
      headers: {
        'Authorization': `Bearer ${publicairtableApiKey}`
      }
    });

    const data = await response.json();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    if (data.records.length === 0) {
      bookList.innerHTML = `<p>No book found with the title: ${selectedBookName}</p>`;
      return;
    }

    const fields = data.records[0].fields;
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book-section');

    bookDiv.innerHTML = `
<div class="book-image">
<img src="${fields.image?.[0]?.url || ''}" alt="Book Image" />
</div>
<div class="book-info">
<div class="input-group">
  <label>Title:</label>
  <input type="text" value="${fields.Book || ''}" readonly />
</div>
<div class="input-group">
  <label>Author:</label>
  <input type="text" value="${fields.Author || ''}" readonly />
</div>
<div class="input-group">
  <label>Category:</label>
  <input type="text" value="${fields.Type || ''}" readonly />
</div>
<div class="buttons">
<button class="action-btn issue-btn">📗 Issue</button>
<button class="action-btn ebook-btn">📘 eBook</button>
<button class="action-btn wishlist-btn">💖 Add to Wishlist</button>
</div>
</div>
<div class="description">
<div class="input-group">
  <label>Description:</label>
  <textarea rows="5" readonly>${fields.About_of_the_book || ''}</textarea>
</div>
</div>
`;


    bookList.appendChild(bookDiv);
    bookDiv.querySelector('.issue-btn').addEventListener('click', () => {
      issueBook(fields);
    });

    bookDiv.querySelector('.ebook-btn').addEventListener('click', () => {
      if (fields.Ebook) {
        window.open(fields.Ebook, '_blank');
      } else {
        alert(`No eBook link available for "${fields.Book}"`);
      }
    });

    bookDiv.querySelector('.wishlist-btn').addEventListener('click', () => {
      addToWishlist(fields);
    });


  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
  }
}
function issueBook(fields) {
const apiUrl = `https://api.airtable.com/v0/${userBaseId}`;
const headers = {
'Authorization': `Bearer ${userairtableApiKey}`,
'Content-Type': 'application/json'
};

const userBookTable = localStorage.getItem('user_book');
const userHistoryTable = localStorage.getItem('user_history');

const today = new Date();
const dueDate = new Date(today);
dueDate.setDate(dueDate.getDate() + 14); // 2-week loan

const payload = {
fields: {
  BookName: fields.Book,
  Author: fields.Author,
  Type: fields.Type,
  Borrowdate: today.toISOString().split('T')[0],
  Rating: fields.Rating,
  Status: "Issued",
}
};

const payload1 = {
fields: {
  BookName: fields.Book,
  BorrowedDate: today.toISOString().split('T')[0],
}
};

// 🆕 Step 1: Check how many books are already issued
fetch(`${apiUrl}/${userBookTable}`, { headers })
.then(res => res.json())
.then(data => {
  const currentIssued = data.records.length;
  const maxAllowed = 5;

  if (currentIssued >= maxAllowed) {
    alert(`You've reached the limit of ${maxAllowed} issued books.`);
    throw new Error('Issue limit reached');
  }

  // Step 2: Check if the current book is already issued
  return fetch(`${apiUrl}/${userBookTable}?filterByFormula={BookName}='${fields.Book}'`, { headers });
})
.then(res => res.json())
.then(data => {
  if (data.records.length > 0) {
    alert(`You've already issued "${fields.Book}".`);
    throw new Error('Book already issued');
  }

  // Step 3: Issue the book
  return fetch(`${apiUrl}/${userBookTable}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload1)
  });
})
.then(response => {
  if (!response || !response.ok) return;
  return fetch(`${apiUrl}/${userHistoryTable}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
})
.then(response => {
  if (response && !response.ok) throw new Error('Failed to add to user_history');
  if (response) alert("Book successfully issued.");
})
.catch(err => {
  if (err.message !== 'Book already issued' && err.message !== 'Issue limit reached') {
    console.error("Error issuing:", err);
    alert("Something went wrong while issuing the book.");
  }
});
}

// function issueBook(fields) {
//   // console.log("userBookTable:", localStorage.getItem('user_book'));
//   // console.log("userHistoryTable:", localStorage.getItem('user_history'));//
//   // console.log("userBaseId:", userBaseId);
//   // console.log("userBaseId:", localStorage.getItem('selectedBookName'));
//   // console.log("API Key:", userairtableApiKey.substring(0, 5) + "...");
//   const apiUrl = `https://api.airtable.com/v0/${userBaseId}`;
//   const headers = {
//     'Authorization': `Bearer ${userairtableApiKey}`,
//     'Content-Type': 'application/json'
//   };

//   const userBookTable = localStorage.getItem('user_book');
//   const userHistoryTable = localStorage.getItem('user_history');
//   console.log(userBookTable);
//   console.log(userHistoryTable);
//   const today = new Date();
//   const dueDate = new Date(today);
//   dueDate.setDate(dueDate.getDate() + 14); // due in 7 days

//   const payload = {
//     fields: {
//       BookName: fields.Book,
//       Author: fields.Author,
//       //Type: fields.Type,
//       Borrowdate: today.toISOString().split('T')[0],
//       Rating: fields.Rating,
//       Status: "Issued",
//     }
//   };
//   const payload1 = {
//     fields: {
//       BookName: fields.Book,
//       BorrowedDate: today.toISOString().split('T')[0],
//     }
//   };
//   // 🆕 Check if book is already issued
//   fetch(`${apiUrl}/${userBookTable}?filterByFormula={BookName}='${fields.Book}'`, {
//     headers
//   })
//     .then(res => res.json())
//     .then(data => {
//       if (data.records.length > 0) {
//         alert(`You’ve already issued "${fields.Book}".`);
//         return;
//       }

//       // Proceed to POST if not already issued
//       return fetch(`${apiUrl}/${userBookTable}`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(payload1)
//       });
//     })
//     .then(response => {
//       if (!response || !response.ok) return;
//       return fetch(`${apiUrl}/${userHistoryTable}`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(payload)
//       });
//     })
//     .then(response => {
//       if (response && !response.ok) throw new Error('Failed to add to user_history');
//       if (response) alert("Book successfully issued.");
//     })
//     .catch(err => {
//       console.error("Error issuing:", err);
//       alert("Something went wrong while issuing the book.");
//     });
// }
function addToWishlist(fields) {

  const apiUrl = `https://api.airtable.com/v0/${userBaseId}`;
  const headers = {
    'Authorization': `Bearer ${userairtableApiKey}`,
    'Content-Type': 'application/json'
  };

  const userWishlistTable = 'user1_wishlist';//localStorage.getItem('user_wishlist');
  if (!userWishlistTable) {
    alert('Wishlist table not found in local storage.');
    return;
  }

  // Check if book is already in wishlist
  // fetch(`${apiUrl}/${userWishlistTable}?filterByFormula={BookName}='${fields.Book}'`, {
  //   headers
  // })
  fetch(`${apiUrl}/${userWishlistTable}?filterByFormula=${encodeURIComponent(`{BookName}='${fields.Book}'`)}`, {
    headers
  })
    .then(res => res.json())
    .then(data => {
      if (data.records.length > 0) {
        alert(`"${fields.Book}" is already in your wishlist.`);
        return;
      }

      // If not in wishlist, add it
      const payload = {
        fields: {
          Bookname: fields.Book,
          Image: [{ url: fields.image?.[0]?.url || '' }]
        }
      };

      return fetch(`${apiUrl}/${userWishlistTable}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
    })
    .then(response => {
      if (response && response.ok) {
        alert(`"${fields.Book}" added to your wishlist.`);
      }
    })
    .catch(err => {
      console.error("Error adding to wishlist:", err);
      alert("Something went wrong while adding to wishlist.");
    });
}

// Load book info on window load
window.onload = fetchBooks;