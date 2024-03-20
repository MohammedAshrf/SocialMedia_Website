// => Todo:
// - .

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
console.log(id);

// == Start Dynamic nav-bar == //
function homePage() {
  window.location = `../index.html`;
}
// == End Dynamic nav-bar == //

// == Start comment authentication check == //
const token = localStorage.getItem("token");

let addCommentContainer = ``;
if (token != null) {
  addCommentContainer = `
    <div class="add-comment-container" id="add-comment-container">
      <input type="text" id="add-comment" placeholder="new comment">
      <div onclick="addComment()">Add</div>
    </div>
    `;
} else {
  addCommentContainer = ``;
}
// == End comment authentication check == //

function getPost() {
  axios
    .get(`${baseURL}/posts/${id}`)
    .then((response) => {
      toggleLoader(false);

      let post = response.data.data;
      // console.log(response.data.data);
      document.getElementById("username-span").innerHTML = post.author.username;

      let comments = post.comments;
      let commentsContent = ``;

      for (comment of comments) {
        commentsContent += `
            <div class="p-3" style="background-color: rgb(187, 187, 187);">
                <div>
                    <img src="${comment.profile_image}" class="rounded-circle"
                        style="width: 40px; height: 40px;" alt="image">
                    <b>${comment.author.username}</b>
                </div>
                <div class="mt-3 ms-3">
                    ${comment.body}
                </div>
            </div>
            `;
      }

      const postContent = `
            <div class="card shadow my-3">
                <div class="card-header">
                    <img class="rounded-circle border border-1" style="width: 50px; height: 50px;"
                      src="${post.author.profile_image}" alt="image">
                    <b>${post.author.username}</b>
                </div>
                <div class="card-body">
                    <img class="w-100" src="${post.image}" alt="image">
                    <h6 style="color: rgb(160, 160, 160);">${post.created_at}</h6>
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div class="comments">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                        </svg>
                        <span>(${post.comments_count}) comments</span>
                    </div>
                </div>
                <div id="comments">
                    ${commentsContent}
                    ${addCommentContainer}
                </div>
            </div>
        `;
      document.getElementById("post-card").innerHTML = "";
      document.getElementById("post-card").innerHTML = postContent;
    })
    .catch((error) => {
      console.log(error);
    });
}
getPost();

function addComment() {
  //   console.log("good");
  let newComment = document.getElementById("add-comment").value;
  const params = {
    body: newComment,
  };
  const URL = `${baseURL}/posts/${id}/comments`;
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(URL, params, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false);

      console.log(response.data);
      // console.log("good");
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}
