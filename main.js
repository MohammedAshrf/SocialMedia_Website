// => Todo:
// - .

// == Start infinite scroll == //
const baseURL = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

if (document.getElementById("posts") != null) {
  window.addEventListener("scroll", function () {
    let endOfPage =
      window.innerHeight + window.scrollY >= document.body.scrollHeight;
    // console.log(currentPage, lastPage);
    if (endOfPage && currentPage < lastPage) {
      currentPage += 1;
      getPosts(false, currentPage);
    }
  });
}
// == End infinite scroll == //

// == Start Dynamic nav-bar == //
let navBar = `
<div class="d-flex justify-content-center">
    <div class="col-9">
        <nav class="navbar navbar-expand-lg bg-body-tertiary shadow rounded pt-2">
            <div class="container-fluid">
                <a class="navbar-brand" onclick="homePage()">Tashkeel</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" onclick="homePage()">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" onclick="profileClicked()">Profile</a>
                        </li>
                    </ul>
                    <div id="login-username">
                        <!-- <button type="button" data-bs-toggle="modal" data-bs-target="#register-modal"
                            class="btn btn-outline-success me-3">Register</button>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#login-modal"
                            class="btn btn-outline-success">Log in</button> -->
                    </div>
                </div>
            </div>
        </nav>
    </div>
</div>
  `;
document.getElementById("nav-bar").innerHTML = navBar;
function homePage() {
  window.location = `#/`;
}
// == End Dynamic nav-bar == //

getPosts();
function getPosts(reload = true, page = 1) {
  axios
    .get(`${baseURL}/posts?limit=3&page=${page}`)
    .then((response) => {
      toggleLoader(false);

      // console.log(response.data.data);
      let posts = response.data.data;
      lastPage = 30;
      let htmlPosts = document.getElementById("posts");

      if (htmlPosts != null) {
        if (reload) {
          htmlPosts.innerHTML = "";
        }

        for (post of posts) {
          let showUser = getCurrentUser();
          let isMyPost = showUser != null && post.author.id == showUser.id;
          let editBtnContent = ``;
          let deleteBtnContent = ``;
          let userId = post.author.id;
          // console.log(post.author.profile_image);
          if (isMyPost) {
            editBtnContent = `
            <button class="btn btn-secondary" style="float: right" onclick="editPost('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Edit</button>`;
            deleteBtnContent = `
            <button class="btn btn-danger me-3" style="float: right" data-bs-toggle="modal" data-bs-target="#delete-post-modal"
            onclick="deletePost('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Delete</button>`;
          }
          htmlPosts.innerHTML += `
          <div class="card shadow my-3">
              <div class="card-header">
                  <img class="rounded-circle border border-1" style="width: 50px; height: 50px;"
                    src="${post.author.profile_image}" alt="image" onclick="goToProfile(${userId})">
                  <b onclick="goToProfile(${userId})">${post.author.username}</b>
                  ${editBtnContent}
                  ${deleteBtnContent}
              </div>
              <div class="card-body" onclick="clickedPost(${post.id})">
                  <img class="w-100" src="${post.image}" alt="image">
                  <h6 style="color: rgb(160, 160, 160);">${post.created_at}</h6>
                  <h5>${post.title}</h5>
                  <p>${post.body}</p>
                  <hr>
                  <div class="comments">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          class="bi bi-pen" viewBox="0 0 16 16">
                          <path
                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                      </svg>
                      <span>(${post.comments_count}) comments</span>
                      <span id="tags-${post.id}">
                        <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                          Policy
                        </button>
                      </span>
                  </div>
              </div>
          </div>`;
          document.getElementById(`tags-${post.id}`).innerHTML = "";
          for (tag of post.tags) {
            // console.log(tag);
            // console.log("hi");
            let content = `                
        <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">
          ${tag.name}
        </button>`;
            document.getElementById(`tags-${post.id}`).innerHTML += content;
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// console.log("hello world");

function login() {
  // alert("hi");
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  const params = {
    username: username,
    password: password,
  };

  const URL = `${baseURL}/login`;
  axios
    .post(URL, params)
    .then((response) => {
      toggleLoader(false);

      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      // alert("user logged in succesfully");
      setupUI();
      addBtn();
      location.reload();
    })
    .catch((error) => {
      console.log(error.response.data.message);
      let message = error.response.data.message;
      document.getElementById("login-error").style.display = "block";
      document.getElementById("login-error").innerHTML = message;
    });
  // console.log(username, password);
}

function register() {
  // alert("hi");
  let username = document.getElementById("reg-username").value;
  let name = document.getElementById("name").value;
  let password = document.getElementById("reg-password").value;
  let registerImage = document.getElementById("register-image").files[0];
  console.log(registerImage);

  let formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  formData.append("image", registerImage);

  const URL = `${baseURL}/register`;
  axios
    .post(URL, formData)
    .then((response) => {
      toggleLoader(false);

      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      // alert("user logged in succesfully");
      setupUI();
      addBtn();
      location.reload();
    })
    .catch((error) => {
      // console.log(error);
      if (error.response.status == 422) {
        console.log(error.response.data.message);
        let message = error.response.data.message;
        document.getElementById("error").style.display = "block";
        document.getElementById("error").innerHTML = message;
      }
    });
  // console.log(username, password);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  addBtn();
  location.reload();
}
// logout();

function setupUI() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(username.username);

  if (token == null) {
    document.getElementById("login-username").innerHTML = "";
    document.getElementById("login-username").innerHTML = `
      <div id="login-username">
        <button type="button" data-bs-toggle="modal" data-bs-target="#register-modal"
            class="btn btn-outline-success me-3">Register</button>
        <button type="button" data-bs-toggle="modal" data-bs-target="#login-modal"
            class="btn btn-outline-success">Log in</button>
      </div>
    `;
  } else {
    document.getElementById("login-username").innerHTML = "";
    document.getElementById("login-username").innerHTML = `
      <div id="login-username">
      <img src="${user.profile_image}" alt="Image" id="profile-image">
      <div class="btn btn-outline-success me-3" id="profile-username">${user.username}</div>
      <button id="logout-btn" onclick="logout()" type="button" data-bs-toggle="modal"
          class="btn btn-outline-danger">Log out</button>
      </div>
    `;
  }
}
setupUI();

function addBtn() {
  let token = localStorage.getItem("token");
  let addPost = document.getElementById("add-post");
  if (addPost != null) {
    // console.log(token);
    if (token == null) {
      addPost.style.display = "none";
    } else {
      addPost.style.display = "block";
    }
  }
}
addBtn();

function createPost() {
  // console.log("Done");
  let postId = document.getElementById("edit-post").value;
  let isCreate = postId == null || postId == "";
  console.log(isCreate);
  let title = document.getElementById("post-title").value;
  let body = document.getElementById("post-body").value;
  let image = document.getElementById("post-image").files[0];

  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  let URL = ``;
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    URL = `${baseURL}/posts`;
  } else {
    URL = `${baseURL}/posts/${postId}`;
    formData.append("_method", "put");
  }
  axios
    .post(URL, formData, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false);

      console.log(response.data);
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      location.reload();
      appendAlert("Done, you created a new post", "success");
      setTimeout(() => {
        document.getElementById("liveAlertPlaceholder").style.display = "none";
        // console.log("good");
      }, 3000);
    })
    .catch((error) => {
      if (error.response.status == 422) {
        const imageError = error.response.data.message;
        document.getElementById("image-error").style.display = "block";
        document.getElementById("image-error").innerHTML = imageError;
      }
    });
}

const appendAlert = (message, type, fadeOrShow) => {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible ${fadeOrShow}" role="alert">
       <div>${message}</div>
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`,
  ].join("");
  alertPlaceholder.append(wrapper);
};

// == Start postDetails page == //
function clickedPost(postId) {
  // alert(postId);
  window.location = `../post details page/postDetails.html?postId=${postId}`;
}
// == End postDetails page == //

function getCurrentUser() {
  let currentUser = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    currentUser = JSON.parse(storageUser);
    // document.getElementById("user-id").value = currentUser.id;
  }
  return currentUser;
}

function createPostModal() {
  // console.log("good");
  document.getElementById("edit-post").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create a new post";
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
  document.getElementById("create-btn").innerHTML = "Create";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function editPost(postObj) {
  // console.log("good");
  let post = JSON.parse(decodeURIComponent(postObj));
  console.log(post);
  document.getElementById("edit-post").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit post";
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-body").value = post.body;
  document.getElementById("create-btn").innerHTML = "Update";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function deletePost(postObj) {
  console.log("delete");
  let post = JSON.parse(decodeURIComponent(postObj));
  console.log(post);
  document.getElementById("delete-post-id").value = post.id;
}

function deletePostConfirm() {
  console.log("confirm");
  let postId = document.getElementById("delete-post-id").value;

  let URL = ``;
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };

  URL = `${baseURL}/posts/${postId}`;
  axios
    .delete(URL, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false);

      console.log("good");
      console.log(response.data);
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      location.reload();
      appendAlert("Done, you've deleted the post", "danger");
      setTimeout(() => {
        document.getElementById("liveAlertPlaceholder").style.display = "none";
        // console.log("good");
      }, 3000);
    })
    .catch((error) => {
      console.log(error);
    });
}

function goToProfile(userId) {
  window.location = `#/profile.html?userId=${userId}`;
}

function profileClicked() {
  let currentUser = getCurrentUser();
  console.log(currentUser);
  window.location = `#/profile.html?userId=${currentUser.id}`;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
toggleLoader(true);
