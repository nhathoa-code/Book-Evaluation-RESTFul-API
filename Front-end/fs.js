let token = getCookie("token");
let userId = getCookie("userId");
let isbn = localStorage.getItem("isbn");
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

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
      setCookie("userId", "", -1);
      setCookie("token", "", -1);
      window.location = "login.html";
    })
    .catch((error) => {
      console.log(error);
    });
}
