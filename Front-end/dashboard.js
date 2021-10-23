/*---------------------------------------- 
            adding book
----------------------------------------*/
$(".Add-book-modal form").submit(function (e) {
  e.preventDefault();
  let Add_book_form = document.querySelector(".Add-book-modal form");
  let formData = new FormData(Add_book_form);
  $("#isbn_error").remove();
  $("#title_error").remove();
  $("#author_error").remove();
  $("#published_error").remove();
  $("#file_error").remove();
  axios({
    method: "POST",
    url: "http://127.0.0.1:8000/api/book",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      $(".Add-book-modal").modal("hide");
      $(".Add-book-modal form").trigger("reset");
      $("#books-list").append(`<tr data-id="${res.data.isbn}">
                  <th scope="row">
                      <img src="${res.data.image}" alt="">
                  </th>
                  <td>${res.data.isbn}</td>
                  <td>${res.data.title}</td>
                  <td>${res.data.author}</td>
                  <td>
                      <a href="javascript:edit_book_form(${res.data.isbn})">Edit</a>
                  </td>
                  <td>
                      <a href="javascript:delete_book(${res.data.isbn})">Delete</a>
                  </td>
              </tr>`);
    })
    .catch((error) => {
      let isbn = error.response.data.errors.isbn;
      let title = error.response.data.errors.title;
      let author = error.response.data.errors.author;
      let published = error.response.data.errors.published;
      let file = error.response.data.errors.file;
      check_error("isbn", ".Add-book-modal form", isbn);
      check_error("title", ".Add-book-modal form", title);
      check_error("author", ".Add-book-modal form", author);
      check_error("published", ".Add-book-modal form", published);
      check_error("file", ".Add-book-modal form", file);
    });
});
function check_error(name, form, field) {
  if (field) {
    if (!$(`#${name}_error`).length) {
      $(`${form} input[name='${name}']`)
        .closest("div")
        .after(`<p style="color:red" id="${name}_error">${field}</p>`);
    }
  }
}
/*---------------------------------------- 
            getting books
----------------------------------------*/
axios({
  method: "GET",
  url: "http://127.0.0.1:8000/api/books",
})
  .then((res) => {
    //console.log(res.data);
    let output = "";
    res.data.forEach(function (book) {
      output += `<tr data-id="${book.isbn}">
                <th scope="row">
                    <img src="${book.image}" alt="">
                </th>
                <td>${book.isbn}</td>
                <td>${book.Title}</td>
                <td>${book.Author}</td>
                <td>
                    <a href="javascript:edit_book_form(${book.isbn})">Edit</a>
                </td>
                <td>
                    <a href="javascript:delete_book(${book.isbn})">Delete</a>
                </td>
            </tr>`;
    });
    $("#books-list").html(output);
  })
  .catch((error) => {
    console.log(error.response.data.errors);
  });
/*---------------------------------------- 
                delete book
----------------------------------------*/
function delete_book(isbn) {
  axios({
    method: "DELETE",
    url: `http://127.0.0.1:8000/api/book/${isbn}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      $(`#books-list tr[data-id="${isbn}"]`).remove();
    })
    .catch((error) => {
      console.log(error);
    });
}
/*---------------------------------------- 
            show form edit book
----------------------------------------*/
function edit_book_form(isbn) {
  axios({
    method: "GET",
    url: `http://127.0.0.1:8000/api/book/${isbn}`,
  })
    .then((res) => {
      $("#editModal form input[name='isbn']").val(`${res.data.book.isbn}`);
      $("#editModal form input[name='title']").val(`${res.data.book.Title}`);
      $("#editModal form input[name='author']").val(`${res.data.book.Author}`);
      $("#editModal form input[name='published']").val(
        `${res.data.book.Published}`
      );
      $("#editModal form input[name='file']")
        .closest("div")
        .after(`<img src="${res.data.book.image}">`);
      $("#editModal").modal("show");
    })
    .catch((error) => {
      console.log(error);
    });
}
/*---------------------------------------- 
            editting book
----------------------------------------*/
$("#editModal form").submit(function (e) {
  e.preventDefault();
  let isbn = $(`#editModal form input[name="isbn"]`).val();
  let Edit_form = document.querySelector("#editModal form");
  let formData = new FormData(Edit_form);
  formData.append("_method", "PUT");
  axios({
    method: "POST",
    url: `http://127.0.0.1:8000/api/book/${isbn}`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  })
    .then((res) => {
      $(`tr[data-id=${isbn}]`).html(` <th scope="row">
                      <img src="${res.data.image}" alt="">
                  </th>
                  <td>${res.data.isbn}</td>
                  <td>${res.data.Title}</td>
                  <td>${res.data.Author}</td>
                  <td>
                      <a href="javascript:edit_book_form(${res.data.isbn})">Edit</a>
                  </td>
                  <td>
                      <a href="javascript:delete_book(${res.data.isbn})">Delete</a>
                  </td>`);
      $("#editModal").modal("hide");
    })
    .catch((error) => {
      console.log(error.response.data);
    });
});
/*---------------------------------------- 
            capture add modal closed
----------------------------------------*/
$(".Add-book-modal").on("hidden.bs.modal", function () {
  $("#isbn_error").remove();
  $("#title_error").remove();
  $("#author_error").remove();
  $("#published_error").remove();
  $("#file_error").remove();
  $(".Add-book-modal form").trigger("reset");
});
/*---------------------------------------- 
            capture edit modal closed
----------------------------------------*/
$("#editModal").on("hidden.bs.modal", function () {
  $("#editModal img").remove();
});
