// ===> My way to get the user id:
// const storageUser = localStorage.getItem("user");
// const currentUser = JSON.parse(storageUser);
// const id = currentUser.id;
// console.log(currentUser);

// ===> My instructor way to get the user id:
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("userId");

// == Start Dynamic nav-bar == //
function homePage() {
  window.location = `../index.html`;
}
// == End Dynamic nav-bar == //

getUser();
function getUser() {
  // const id = 9141;
  axios.get(`${baseURL}/users/${id}`).then((response) => {
    toggleLoader(false);

    // console.log(response.data.data);
    const user = response.data.data;
    document.getElementById("header-image").src = user.profile_image;
    document.getElementById("profile-title").innerHTML = user.username;
    document.getElementById("profile-email").innerHTML = user.email;
    document.getElementById("profile-user").innerHTML = user.username;
    document.getElementById(
      "posts-number"
    ).innerHTML = `<span>${user.posts_count}</span> Posts`;
    document.getElementById(
      "comments-number"
    ).innerHTML = `<span>${user.comments_count}</span> Comments`;
  });
}

function getPosts() {
  // const id = 9141;

  axios
    .get(`${baseURL}/users/${id}/posts`)
    .then((response) => {
      toggleLoader(false);

      // console.log(response.data.data);
      const posts = response.data.data;
      const htmlPosts = document.getElementById("user-posts");

      if (htmlPosts != null) {
        htmlPosts.innerHTML = "";

        for (post of posts) {
          let showUser = getCurrentUser();
          let isMyPost = showUser != null && post.author.id == showUser.id;
          let editBtnContent = ``;
          let deleteBtnContent = ``;

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
                    src="${post.author.profile_image}" alt="image">
                  <b>${post.author.username}</b>
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
getPosts();
