import { LoadNav } from "../funcs/navbar";
import noheart from "../assets/unliked.svg";
import heart from "../assets/liked.svg";
import imgupload from "../assets/imageupload.svg";
import hashtag from "../assets/hashtag.svg";
import { OrgIndexPosts } from "../funcs/posts";
import { convertImageToBase64 } from "../funcs/utils";

export const Home = async () => {
  if (!sessionStorage.getItem("user_token")) {
    window.location.assign("/login");
    return;
  }

  document.getElementById("app").innerHTML = `
    ${LoadNav()}
    <div class="lower-div">
    <main>
      <div id="c-post-modal" class="modal">
        <div class="modal-content">
            <div id="c-post-userinfo">
                <div id="c-post-pfp">
                    <img src="${sessionStorage.getItem("avatar")}">
                </div>
                <p id="c-post-nickname">${sessionStorage.getItem(
                  "username"
                )}</p>
            </div>
            <textarea id="c-post-textArea"
                placeholder="What's on your mind?"></textarea>
            <div id="c-post-options">
                <div class="c-post-option">
                    <img src="${imgupload}" alt="upload Image"
                        title="upload Image" id="c-img-upload">
                    <input type="file" id="img-upload">
                </div>
                <div class="c-post-option">
                    <img src="${hashtag}" alt="Choose Category"
                        title="Choose Category" id="cat-choose-Btn">
                </div>
            </div>
            <div id="c-post-cats">
                <select id="c-post-cat-select">
                    <option class="c-option" value="1">General</option>
                    <option class="c-option" value="2">Engineering</option>
                    <option class="c-option" value="3">Travel</option>
                    <option class="c-option" value="4">Tech</option>
                    <option class="c-option" value="5">Mathematics</option>
                </select>
            </div>
            <div id="c-post-Btn">Create Post</div>
        </div>
      </div>
      <div id="posts"></div>
    </main>
  
    <div class="side-divs">
      <div class="profile-card">
        <div class="profile-header">
          <div class="profileImage">
            <img src="${sessionStorage.getItem("avatar")}" alt="">
          </div>
        </div>
        <div class="UserInfo-div">
          <p class="UserName-p">${sessionStorage.getItem("username")}</p>
          <p class="profile-title">Profile</p>
        </div>
      </div>
      <div class="categories-section">
        <h2 class="categories-text">Users</h2>
        <ul class="category-list">
        </ul>
      </div>
    </div>
  </div>
  `;

  // try {
  //   const response = await fetch("/categories");

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   const data = await response.json();
  //   const categoryList = document.querySelector(".category-list");

  //   data.forEach((category) => {
  //     const li = document.createElement("li");
  //     li.textContent = category.name;
  //     categoryList.appendChild(li);
  //   });
  // } catch (error) {
  //   console.error("Fetch failed:", error);
  // }

  // Modal Operations
  var modal = document.getElementById("c-post-modal");
  var modalOpenBtn = document.getElementById("c-post-start");

  const encodedImage = sessionStorage.getItem("avatar"); // replace with the encoded image string

  const img = new Image();
  let url = "data:image/png;base64," + encodedImage;
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      
    });
  document.getElementById("c-avatar").appendChild(img);

  if (modalOpenBtn && modal) {
    modalOpenBtn.onclick = function () {
      modal.style.display = "block";
    };
  }

  // When user clicks outside window, remove modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const create_post_Btn = document.getElementById("c-post-Btn");

  if (create_post_Btn) {
    create_post_Btn.addEventListener("click", async () => {
      const post_text = document.getElementById("c-post-textArea").value;
      const raw_image_file = document.getElementById("c-img-upload").value;
      const post_category = document.getElementById("cat-choose-Btn").value;

      const Image_Converstion_wrapper = async () => {
        return await convertImageToBase64(raw_image_file);
      };

      const postImage = await Image_Converstion_wrapper();

      const post_data = {
        user_token: sessionStorage.getItem("user_token"),
        post_text: post_text,
        post_image_base64: postImage,
        post_category: post_category,
      };

      try {
        const res = await fetch("/post/create", {
          method: "POST",
          body: JSON.stringify(post_data),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        modal.style.display = "none";

        if (res.status === 201) {
          window.location.reload();
        } else {
          throw new Error(res.status, res.statusText);
        }
      } catch (error) {
        alert(error);
        console.error("post creation error", error);
      }
    });
  }
  let toggled = false;

  document.getElementById("cat-choose-Btn").addEventListener("click", () => {
    toggled = !toggled;
    if (toggled) {
      document.getElementById("c-post-cats").style.display = "block";
    } else {
      document.getElementById("c-post-cats").style.display = "none";
    }
  });

  document.getElementById("c-img-upload").addEventListener("click", () => {
    document.getElementById("img-upload").click();
  });

  const likeImages = document.querySelectorAll(".p-likeBtn img");

  console.log(likeImages);

  likeImages.forEach((likeBtn) => {
    console.log(likeBtn.getAttribute("src"));

    likeBtn.addEventListener("click", () => {
      if (likeBtn.getAttribute("src") === noheart) {
        likeBtn.setAttribute("src", heart);
        console.log("liked");
        // add other like event
      } else {
        likeBtn.setAttribute("src", noheart);
        console.log("unliked");
        // add other unlike event
      }
    });
  });

  await OrgIndexPosts();
};
