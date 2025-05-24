const apiKey = "patS92D0eYMYtZ8Zf.eeadd8c64bf1e90d4ae313c6e7d79f7d27d4cf4496797339e330ddfb514998f3";
const baseId = "appyj1ktTZGgXl2vP";
const tableName = "users_credentials";
document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();

    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;

    fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const match = data.records.find(
          (record) =>
            record.fields.user_id === userEmail &&
            record.fields.password === userPassword
        );
        if (match) {
          localStorage.setItem('user_history', match.fields.history);
          localStorage.setItem('user_book', match.fields.user_page);
          localStorage.setItem('user_name', match.fields.username);
          localStorage.setItem('user_email', match.fields.user_id);
          localStorage.setItem('user_since', match.fields.user_since);
          localStorage.setItem('user_photo', match.fields.user_photo);
          localStorage.setItem('user_wishlist', match.fields.user_wishlist);
          window.location.href = "home/home.html";
          //window.location.href = "collections.html";
        } 
        else {
          alert("Invalid credentials");
        }
      });
  });