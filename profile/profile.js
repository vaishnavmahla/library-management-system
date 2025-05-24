// Toggle dropdown menu
const profilePic = document.getElementById('profile-pic');
const dropdown = document.getElementById('dropdown');

const apiKey = 'patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3';
const baseId = 'appyj1ktTZGgXl2vP';

profilePic.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profilePic.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Toggle mobile menu
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');

    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
});

const tableName1 = localStorage.getItem('user_book');
// Sample data
// const userBooks = { issued: 2 };
const userBooks = { issued: 0 }; // Initial value, will update after fetch

// Render book cards
const bookList = document.getElementById('book-list');

// fetch(`https://api.airtable.com/v0/${baseId}/${tableName1}`, {
//     headers: {
//         Authorization: `Bearer ${apiKey}`
//     }
// })
//     .then(res => res.json())
//     .then(data => {
//         userBooks.issued = data.records.length; // Get the number of issued books
        
//         issuedCount.textContent = userBooks.issued; // Update text
//         animatePieChart(userBooks.issued, 5, 1000); // Trigger pie chart animation

//         data.records.forEach((record, index) => {
//             const fields = record.fields;
//             const title = fields.BookName || 'Untitled';
//             const daysLeft = fields.DaysLeft ?? -1;
            
//             let statusClass = 'safe';
//             if (daysLeft <= 0) {
//                 statusClass = 'danger';
//             } else if (daysLeft <= 5) {
//                 statusClass = 'warning';
//             }
            
//             const daysText = daysLeft <= 0 ? 'Overdue!' : `${daysLeft}`;

//             const bookCard = document.createElement('div');
//             bookCard.className = `book-card ${statusClass} animate`;
//             bookCard.style.animationDelay = `${index * 0.2}s`;

//             bookCard.innerHTML = `
//                 <span class="book-title">${title}</span>
//                 <span class="days-left ${statusClass}">${daysText}</span>
//             `;

//             bookList.appendChild(bookCard);
//         });
//     })
//     .catch(err => console.error("Error fetching Book Due Tracker data:", err));
fetch(`https://api.airtable.com/v0/${baseId}/${tableName1}?view=Grid%20view`, {
    headers: {
        Authorization: `Bearer ${apiKey}`
    }
})
    .then(res => res.json())
    .then(data => {
        userBooks.issued = data.records.length; // Get the number of issued books
        
        issuedCount.textContent = userBooks.issued; // Update text
        animatePieChart(userBooks.issued, 5, 1000); // Trigger pie chart animation

        data.records.forEach((record, index) => {
            const fields = record.fields;
            const title = fields.BookName || 'Untitled';
            const daysLeft = fields.DaysLeft ?? -1;
            const days = fields.Days;
            
            let statusClass = 'safe';
            if (days <= 0) {
                statusClass = 'danger';
            } else if (days <= 5) {
                statusClass = 'warning';
            }
            
            const daysText = daysLeft <= 0 ? 'Overdue!' : `${daysLeft}`;

            const bookCard = document.createElement('div');
            bookCard.className = `book-card ${statusClass}`;
            bookCard.style.animationDelay = `${index * 0.2}s`;

            bookCard.innerHTML = `
                <span class="book-title">${title}</span>
                <span class="days-left ${statusClass}">${daysText}</span>
            `;

            bookList.appendChild(bookCard);
        });
    })
    .catch(err => console.error("Error fetching Book Due Tracker data:", err));

// Draw pie chart
const pieChart = document.getElementById('pieChart');
const ctx = pieChart.getContext('2d');
const issuedCount = document.getElementById('issuedCount');

issuedCount.textContent = userBooks.issued;

function drawPieChart(issued, total, progress = 1) {
    const centerX = pieChart.width / 2;
    const centerY = pieChart.height / 2;
    const radius = 80;

    // Clear canvas
    ctx.clearRect(0, 0, pieChart.width, pieChart.height);

    // Draw available portion (light gray)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();

    // Draw issued portion with progress
    const issuedRatio = (issued / total) * progress;
    const endAngle = 2 * Math.PI * issuedRatio;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, endAngle, false);
    ctx.fillStyle = '#7494ec';
    ctx.fill();

    // Draw inner circle (white hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw text in center
    ctx.font = 'bold 30px Poppins';
    ctx.fillStyle = '#343a40';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${issued}/${total}`, centerX, centerY);
}

// Animate pie chart on page load
function animatePieChart(issued, total, duration = 1000) {
    let startTime = null;

    function animationFrame(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Progress from 0 to 1

        drawPieChart(issued, total, progress);

        if (progress < 1) {
            requestAnimationFrame(animationFrame);
        }
    }

    requestAnimationFrame(animationFrame);
}

// Trigger animation on page load
// window.addEventListener('load', () => {
//     animatePieChart(userBooks.issued, 5, 1000); // Animate over 1 second
// });

// Airtable API details
const tableName = localStorage.getItem('user_history');

fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?view=Grid%20view`, {
    headers: {
        Authorization: `Bearer ${apiKey}`
    }
})
    .then(res => res.json())
    .then(data => {
        const tableBody = document.querySelector("#feeTable tbody");

        // Sort by DueDate
        data.records.sort((a, b) => {
            const dateA = new Date(a.fields.DueDate);
            const dateB = new Date(b.fields.DueDate);
            return dateA - dateB;
        });

        data.records.forEach(record => {
            const row = document.createElement("tr");

            const fields = record.fields;
            // const statusBtn = fields.Status === "Book in advance"
            //     ? `<button class="btn-advance">Book in advance</button>`
            //     : `<button class="btn-pay">Pay</button>`;

            row.innerHTML = `
                <td>${fields.BookName || "---"}</td>
                <td>${fields.Author || "---"}</td>
                <td>${fields.Type || "---"}</td>
                <td>${fields.Borrowdate || "---"}</td>
                <td>${fields.Rating || "---"}</td>
                <td>${fields.Status}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(err => console.error("Error loading Airtable data:", err));

document.getElementById('user-name').textContent = localStorage.getItem('user_name') || 'John Doe';
document.getElementById('user-email').textContent = localStorage.getItem('user_email') || 'john@example.com';
document.getElementById('user-since').textContent = localStorage.getItem('user_since') || 'January 2023';
const userPhoto = localStorage.getItem('user_photo') || 'profile-pic.jpg';

document.querySelectorAll('#user-photo').forEach(img => {
    img.src = userPhoto;
});

// document.getElementById('user-photo').src = localStorage.getItem('user_photo') || 'profile-pic.jpg';