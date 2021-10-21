/*---------------------------------------- 
            evaluating book
----------------------------------------*/
let star = 1;
$(".rating-item").mouseover(function () {
  for (let i = 1; i <= $(this).attr("data"); i++) {
    $(`.rating-item-${i}`).addClass("active");
  }
  for (let i = $(this).attr("data") * 1 + 1; i <= 5; i++) {
    $(`.rating-item-${i}`).removeClass("active");
  }
  star = $(this).attr("data") * 1;
});
/*---------------------------------------- 
            getting a book
----------------------------------------*/
axios({
  method: "GET",
  url: `http://127.0.0.1:8000/api/book/${isbn}`,
})
  .then(function (res) {
    console.log(res.data);
    let user_comment = res.data.reviews.find(function (v) {
      return v.user_id == userId;
    });
    if (user_comment) {
      $("#review-btn").attr("data-bs-target", "#alertModal");
    }
    let output = "";
    res.data.reviews.forEach(function (v) {
      output += `<div class="review row">
                <div class="col-md-3">
                    <p>${v.name}</p>
                    <p style="font-size:0.75rem">${v.date}</p>
                </div>
                <div class="col-md-9">
                    <div class="rating-box">
                        <div class="rating" style="width:${v.star * 20}%"></div>
                    </div>
                    <p class="mt-2">${v.content}</p>
                </div>
                </div>`;
    });
    $("#review-box").html(output);
    res.data.rating_points.forEach(function (v) {
      $(`#rating-chart .review-rating-${v.star} > div`).css(
        "width",
        `${Math.round((v.point_count / res.data.metaData.review_count) * 100)}%`
      );
      $(`#rating-chart .review-rating-${v.star} ~ span`).text(
        `${Math.round((v.point_count / res.data.metaData.review_count) * 100)}%`
      );
    });
    $("#rating-point").text(res.data.book.Average_score);
    $("#box-point .rating").css(
      "width",
      `${res.data.book.Average_score * 20}%`
    );
    $("#book-info img").attr("src", res.data.book.image);
    $("#isbn span").text(res.data.book.isbn);
    $("#title span").text(res.data.book.Title);
    $("#author span").text(res.data.book.Author);
    $("#published span").text(res.data.book.Published);
    $("#add-review").attr("onclick", `review(${res.data.book.isbn})`);
    $("#review-count").text(res.data.metaData.review_count);
  })
  .catch(function (error) {
    console.log(error);
  });
/*---------------------------------------- 
            showing reviews
----------------------------------------*/
function review(isbn) {
  let form = document.querySelector("#reviewModal form");
  let formData = new FormData(form);
  formData.append("isbn", isbn);
  formData.append("star", star);
  formData.append("user_id", userId);
  axios({
    method: "POST",
    url: `http://127.0.0.1:8000/api/review/add`,
    data: formData,
  })
    .then(function (res) {
      location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log(isbn);
}
