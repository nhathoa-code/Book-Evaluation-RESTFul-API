let books_container = document.getElementById("books-container");
/*---------------------------------------- 
            getting all books
----------------------------------------*/
axios({
  method: "GET",
  url: "http://127.0.0.1:8000/api/books",
})
  .then((res) => {
    let output = "";
    res.data.forEach((book) => {
      output += `<div class="book col-md-3">
                <div class="image">
                <a href="javascript:book(${book.isbn})">
                    <img src="${book.image}" alt="book">
                </a>
                </div>
                <p class="title">${book.Title}</p>
                <div class="rating-box">
                    <div class="rating" style="width:${
                      book.Average_score * 20
                    }%"></div>
                </div>
                <span class="evaluation">(${book.Review} lượt xem)</span>
            </div>`;
    });
    books_container.innerHTML = output;
  })
  .catch((error) => {
    console.log(error);
  });
/*---------------------------------------- 
            searching book
----------------------------------------*/
$("form").submit(function (e) {
  e.preventDefault();
  let keyword = $("#search").val();
  if (keyword.length !== 0) {
    axios({
      method: "GET",
      url: `http://127.0.0.1:8000/api/book/search/${keyword}`,
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.length == 0) {
          books_container.innerHTML = `<h1 style="text-align:center;margin-top:2rem">Không tìm thấy !</h1>`;
        } else {
          let output = "";
          res.data.forEach((book) => {
            output += `<div class="book col-md-3">
              <div class="image">
              <a href="javascript:book(${book.isbn})">
                  <img src="${book.image}" alt="book">
              </a>
              </div>
              <p class="title">${book.Title}</p>
              <div class="rating-box">
                  <div class="rating" style="width:${
                    book.Average_score * 20
                  }%"></div>
              </div>
              <span class="evaluation">(${book.Review} lượt xem)</span>
          </div>`;
          });
          books_container.innerHTML = output;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/books",
    })
      .then((res) => {
        let output = "";
        res.data.forEach((book) => {
          output += `<div class="book col-md-3">
                <div class="image">
                <a href="javascript:book(${book.isbn})">
                    <img src="${book.image}" alt="book">
                </a>
                </div>
                <p class="title">${book.Title}</p>
                <div class="rating-box">
                     <div class="rating" style="width:${
                        book.Average_score * 20
                     }%"></div>
                </div>
                <span class="evaluation">(${book.Average_score} lượt xem)</span>
            </div>`;
        });
        books_container.innerHTML = output;
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
/*---------------------------------------- 
            logging out
----------------------------------------*/
function logout() {
  axios({
    method: "POST",
    url: "http://127.0.0.1:8000/logout",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setCookie("typeUser", "", -1);
      setCookie("token", "", -1);
      window.location = "login.html";
    })
    .catch((error) => {
      console.log(error);
    });
}
/*---------------------------------------- 
            setting user info
----------------------------------------*/
if (getCookie("typeUser") == "") {
  window.location = "login.html";
}

if (getCookie("typeUser") != "" && getCookie("typeUser") == 1) {
  $(".dash-box").prepend("<a href='dashboard.html'>dashboard</a>");
}

function book(isbn) {
  localStorage.setItem("isbn", isbn);
  window.open("book.html");
  /*---------------------------------------- 
            increasing review
  ----------------------------------------*/
  axios({
    method: "GET",
    url: `http://127.0.0.1:8000/api/book/reviewIncrement/${isbn}`,
  });
}
