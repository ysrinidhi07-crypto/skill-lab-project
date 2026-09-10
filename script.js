/* =========================================================
   AURA SOCIAL MEDIA APP
   Complete Front-End JavaScript
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let currentPage = "home";

let isLoggedIn = false;

let posts = [];

let selectedConversation = null;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeApp();

});


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

function initializeApp() {

    setupLogin();

    setupPassword();

    setupNavigation();

    setupLikes();

    setupSaveButtons();

    setupFollowButtons();

    setupSearch();

    setupExploreTabs();

    setupStories();

    setupMessages();

    setupProfileTabs();

    setupCreatePost();

    setupComments();

    setupShareButtons();

    setupBackButtons();

    setupKeyboardShortcuts();

    setupLogout();

    createToastContainer();

    loadSavedState();

}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();


        /* Validation */

        if (username === "") {

            showToast(
                "Please enter your username",
                "error"
            );

            return;
        }


        if (password === "") {

            showToast(
                "Please enter your password",
                "error"
            );

            return;
        }


        if (password.length < 4) {

            showToast(
                "Password must contain at least 4 characters",
                "error"
            );

            return;
        }


        /* Login successful */

        isLoggedIn = true;

        localStorage.setItem(
            "auraLoggedIn",
            "true"
        );

        document.getElementById("login").style.display = "none";

        document
            .getElementById("application")
            .classList.add("active");


        showPage("home");

        showToast(
            "Welcome back to Aura ✦",
            "success"
        );

    });

}


/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

function setupPassword() {

    const password =
        document.getElementById("password");

    const button =
        document.getElementById("showPassword");


    if (!password || !button) return;


    button.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            button.textContent = "🙈";

        } else {

            password.type = "password";

            button.textContent = "👁";

        }

    });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navigationButtons =
        document.querySelectorAll(
            ".nav-button[data-page]"
        );


    navigationButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const page =
                    button.dataset.page;

                showPage(page);

            }
        );

    });

}


function showPage(pageName) {

    const page =
        document.getElementById(pageName);


    if (!page) {

        showToast(
            "Page not found",
            "error"
        );

        return;

    }


    /* Hide all pages */

    document
        .querySelectorAll(".page")
        .forEach(function (page) {

            page.classList.remove("active");

        });


    /* Show selected page */

    page.classList.add("active");


    /* Update navigation */

    document
        .querySelectorAll(".nav-button[data-page]")
        .forEach(function (button) {

            button.classList.remove("active");

            if (
                button.dataset.page === pageName
            ) {

                button.classList.add("active");

            }

        });


    currentPage = pageName;


    /* Scroll to top */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   LIKE SYSTEM
   ========================================================= */

function setupLikes() {

    document
        .querySelectorAll(".like")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    toggleLike(button);

                }
            );

        });

}


function toggleLike(button) {

    const number =
        button.querySelector("span");


    let liked =
        button.classList.contains("liked");


    let count =
        getLikeCount(
            number ? number.textContent : "0"
        );


    if (!liked) {

        button.classList.add("liked");

        count++;

        showToast(
            "Post liked ❤️",
            "success"
        );

    } else {

        button.classList.remove("liked");

        count--;

        showToast(
            "Like removed",
            "info"
        );

    }


    if (number) {

        number.textContent =
            formatNumber(count);

    }


    saveAppState();

}


function getLikeCount(value) {

    value =
        String(value)
            .replace(",", "")
            .trim();


    if (value.toLowerCase().includes("k")) {

        return Math.round(
            parseFloat(value) * 1000
        );

    }


    const number =
        parseInt(value);


    return isNaN(number)
        ? 0
        : number;

}


function formatNumber(number) {

    if (number >= 1000) {

        return (
            (number / 1000)
                .toFixed(1)
                .replace(".0", "")
            + "k"
        );

    }

    return number.toString();

}


/* =========================================================
   SAVE POSTS
   ========================================================= */

function setupSaveButtons() {

    document
        .querySelectorAll(".save")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    button.classList.toggle("saved");


                    if (
                        button.classList.contains("saved")
                    ) {

                        showToast(
                            "Post saved 🔖",
                            "success"
                        );

                    } else {

                        showToast(
                            "Removed from saved",
                            "info"
                        );

                    }


                    saveAppState();

                }
            );

        });

}


/* =========================================================
   FOLLOW / UNFOLLOW
   ========================================================= */

function setupFollowButtons() {

    document
        .querySelectorAll(".suggestion button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (
                        button.textContent.trim()
                        === "Follow"
                    ) {

                        button.textContent =
                            "Following";

                        button.style.color =
                            "#77717f";


                        showToast(
                            "You are now following this user",
                            "success"
                        );

                    } else {

                        button.textContent =
                            "Follow";

                        button.style.color =
                            "";


                        showToast(
                            "Unfollowed",
                            "info"
                        );

                    }

                }
            );

        });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const search =
        document.getElementById("search");


    if (!search) return;


    search.addEventListener(
        "input",
        function () {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            const images =
                document.querySelectorAll(
                    ".explore-grid img"
                );


            images.forEach(function (image) {

                if (query === "") {

                    image.style.opacity = "1";

                    image.style.transform =
                        "scale(1)";

                    return;

                }


                /*
                   Since the demo images don't have
                   searchable names, we use a visual
                   filtering effect.
                */

                const alt =
                    (
                        image.alt || ""
                    ).toLowerCase();


                if (
                    alt.includes(query)
                ) {

                    image.style.opacity = "1";

                    image.style.transform =
                        "scale(1.02)";

                } else {

                    image.style.opacity = ".35";

                    image.style.transform =
                        "scale(.98)";

                }

            });

        }
    );

}


/* =========================================================
   EXPLORE TABS
   ========================================================= */

function setupExploreTabs() {

    const tabs =
        document.querySelectorAll(
            ".tabs button"
        );


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                tabs.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                tab.classList.add("active");


                const type =
                    tab.textContent.trim();


                showToast(
                    type + " results",
                    "info"
                );

            }
        );

    });

}


/* =========================================================
   STORIES
   ========================================================= */

function setupStories() {

    const stories =
        document.querySelectorAll(
            ".story"
        );


    stories.forEach(function (story, index) {

        story.addEventListener(
            "click",
            function () {

                if (index === 0) {

                    showToast(
                        "Create your first story ✦",
                        "info"
                    );

                    return;

                }


                const image =
                    story.querySelector("img");


                const name =
                    story.querySelector("span");


                if (!image) return;


                openStoryViewer(
                    image.src,
                    name
                        ? name.textContent
                        : "Aura user"
                );

            }
        );

    });

}


/* =========================================================
   STORY VIEWER
   ========================================================= */

function openStoryViewer(
    image,
    username
) {

    const modal =
        document.createElement("div");


    modal.className =
        "aura-modal story-modal";


    modal.innerHTML = `

        <div class="story-viewer">

            <button class="close-modal">
                ×
            </button>

            <img
                src="${image}"
                alt="Story"
            >

            <div class="story-user">
                ${username}
            </div>

            <div class="story-progress">
                <span></span>
            </div>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".close-modal")
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   CREATE POST
   ========================================================= */

function setupCreatePost() {

    const button =
        document.querySelector(".create-post");


    if (!button) return;


    button.addEventListener(
        "click",
        function () {

            openCreatePostModal();

        }
    );

}


function openCreatePostModal() {

    const modal =
        document.createElement("div");


    modal.className =
        "aura-modal";


    modal.innerHTML = `

        <div class="modal-box">

            <button class="close-modal">
                ×
            </button>

            <h2>Create a post</h2>

            <p class="modal-subtitle">
                Share something with your Aura.
            </p>

            <textarea
                id="newPostText"
                placeholder="What's on your mind?"
            ></textarea>

            <input
                id="newPostImage"
                type="text"
                placeholder="Image URL (optional)"
            >

            <button
                class="modal-primary"
                id="publishPost"
            >
                Publish post
            </button>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".close-modal")
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    modal
        .querySelector("#publishPost")
        .addEventListener(
            "click",
            function () {

                createNewPost(modal);

            }
        );

}


function createNewPost(modal) {

    const text =
        modal
            .querySelector("#newPostText")
            .value
            .trim();


    const image =
        modal
            .querySelector("#newPostImage")
            .value
            .trim();


    if (!text) {

        showToast(
            "Write something before posting",
            "error"
        );

        return;

    }


    const feed =
        document.querySelector(".feed");


    if (!feed) return;


    const article =
        document.createElement("article");


    article.className =
        "post card";


    const imageHTML =
        image
            ? `
                <img
                    class="post-image"
                    src="${image}"
                    alt="User post"
                    onerror="this.style.display='none'"
                >
            `
            : "";


    article.innerHTML = `

        <div class="post-header">

            <div class="user">

                <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                >

                <div>

                    <strong>
                        Aria Morgan
                    </strong>

                    <small>
                        @ariamorgan · now
                    </small>

                </div>

            </div>

            <button>
                •••
            </button>

        </div>


        <p class="post-text">
            ${escapeHTML(text)}
        </p>

        ${imageHTML}


        <div class="post-actions">

            <div>

                <button class="like">
                    ♡ <span>0</span>
                </button>

                <button class="comment-button">
                    💬 <span>0</span>
                </button>

                <button class="share-button">
                    ↗
                </button>

            </div>


            <button class="save">
                🔖
            </button>

        </div>


        <small class="liked">
            Be the first to like this post
        </small>

    `;


    feed.prepend(article);


    setupNewPostButtons(article);


    modal.remove();


    showPage("home");


    showToast(
        "Your post has been published ✦",
        "success"
    );

}


function setupNewPostButtons(article) {

    const like =
        article.querySelector(".like");


    const save =
        article.querySelector(".save");


    const comment =
        article.querySelector(".comment-button");


    const share =
        article.querySelector(".share-button");


    if (like) {

        like.addEventListener(
            "click",
            function () {

                toggleLike(like);

            }
        );

    }


    if (save) {

        save.addEventListener(
            "click",
            function () {

                save.classList.toggle(
                    "saved"
                );

            }
        );

    }


    if (comment) {

        comment.addEventListener(
            "click",
            function () {

                openCommentModal(article);

            }
        );

    }


    if (share) {

        share.addEventListener(
            "click",
            function () {

                sharePost(article);

            }
        );

    }

}


/* =========================================================
   COMMENTS
   ========================================================= */

function setupComments() {

    document
        .querySelectorAll(
            ".post-actions button"
        )
        .forEach(function (button) {

            const text =
                button.textContent.trim();


            if (
                text.includes("💬")
            ) {

                button.classList.add(
                    "comment-button"
                );


                button.addEventListener(
                    "click",
                    function () {

                        const article =
                            button.closest(".post");

                        openCommentModal(article);

                    }
                );

            }

        });

}


function openCommentModal(article) {

    const modal =
        document.createElement("div");


    modal.className =
        "aura-modal";


    modal.innerHTML = `

        <div class="modal-box comment-box">

            <button class="close-modal">
                ×
            </button>

            <h2>Comments</h2>

            <div class="comments-area">

                <div class="comment">

                    <strong>Alex</strong>

                    <p>
                        This looks amazing! ✨
                    </p>

                </div>


                <div class="comment">

                    <strong>Mila</strong>

                    <p>
                        Love this post!
                    </p>

                </div>

            </div>


            <div class="comment-input">

                <input
                    id="commentText"
                    placeholder="Add a comment..."
                >

                <button id="sendComment">
                    Send
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".close-modal")
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    modal
        .querySelector("#sendComment")
        .addEventListener(
            "click",
            function () {

                const input =
                    modal.querySelector(
                        "#commentText"
                    );


                const text =
                    input.value.trim();


                if (!text) {

                    showToast(
                        "Write a comment first",
                        "error"
                    );

                    return;

                }


                const comment =
                    document.createElement("div");


                comment.className =
                    "comment";


                comment.innerHTML = `

                    <strong>
                        Aria Morgan
                    </strong>

                    <p>
                        ${escapeHTML(text)}
                    </p>

                `;


                modal
                    .querySelector(".comments-area")
                    .appendChild(comment);


                input.value = "";


                showToast(
                    "Comment added",
                    "success"
                );

            }
        );

}


/* =========================================================
   SHARE
   ========================================================= */

function setupShareButtons() {

    document
        .querySelectorAll(
            ".post-actions button"
        )
        .forEach(function (button) {

            if (
                button.textContent.trim()
                === "↗"
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        const article =
                            button.closest(".post");

                        sharePost(article);

                    }
                );

            }

        });

}


function sharePost(article) {

    const shareText =
        "Check out this post on Aura ✦";


    if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(shareText)
            .then(function () {

                showToast(
                    "Post link copied",
                    "success"
                );

            })
            .catch(function () {

                showToast(
                    "Post ready to share",
                    "info"
                );

            });

    } else {

        showToast(
            "Post ready to share",
            "info"
        );

    }

}


/* =========================================================
   MESSAGES
   ========================================================= */

function setupMessages() {

    const messages =
        document.querySelectorAll(
            ".message"
        );


    messages.forEach(function (message) {

        message.addEventListener(
            "click",
            function () {

                openConversation(message);

            }
        );

    });


    const messageTabs =
        document.querySelectorAll(
            ".message-tabs button"
        );


    messageTabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                messageTabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add("active");


                if (
                    tab.textContent
                        .toLowerCase()
                        .includes("request")
                ) {

                    showToast(
                        "Message requests",
                        "info"
                    );

                }

            }
        );

    });

}


function openConversation(message) {

    const name =
        message.querySelector(
            "strong"
        )?.textContent || "User";


    const image =
        message.querySelector(
            "img"
        )?.src || "";


    selectedConversation =
        name;


    const existing =
        document.querySelector(
            ".conversation-modal"
        );


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement("div");


    modal.className =
        "aura-modal conversation-modal";


    modal.innerHTML = `

        <div class="modal-box chat-box">

            <button class="close-modal">
                ×
            </button>

            <div class="chat-header">

                <img src="${image}">

                <div>
                    <strong>
                        ${name}
                    </strong>

                    <small>
                        Active now
                    </small>
                </div>

            </div>


            <div
                class="chat-messages"
                id="chatMessages"
            >

                <div class="chat-bubble received">
                    Hey! How are you?
                </div>

                <div class="chat-bubble sent">
                    I'm doing great! ✨
                </div>

            </div>


            <div class="chat-input">

                <input
                    id="messageInput"
                    placeholder="Write a message..."
                >

                <button id="sendMessage">
                    ➤
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".close-modal")
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    const input =
        modal.querySelector(
            "#messageInput"
        );


    const send =
        modal.querySelector(
            "#sendMessage"
        );


    function sendMessage() {

        const text =
            input.value.trim();


        if (!text) return;


        const bubble =
            document.createElement("div");


        bubble.className =
            "chat-bubble sent";


        bubble.textContent =
            text;


        modal
            .querySelector("#chatMessages")
            .appendChild(bubble);


        input.value = "";


        const container =
            modal.querySelector(
                "#chatMessages"
            );


        container.scrollTop =
            container.scrollHeight;

    }


    send.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                sendMessage();

            }

        }
    );

}


/* =========================================================
   PROFILE TABS
   ========================================================= */

function setupProfileTabs() {

    const tabs =
        document.querySelectorAll(
            ".profile-tabs button"
        );


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                tabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add("active");


                const text =
                    tab.textContent
                        .trim()
                        .toLowerCase();


                if (
                    text.includes("reels")
                ) {

                    showToast(
                        "Profile reels selected",
                        "info"
                    );

                }


                if (
                    text.includes("saved")
                ) {

                    showToast(
                        "Your saved posts",
                        "info"
                    );

                }


                if (
                    text.includes("posts")
                ) {

                    showToast(
                        "Your posts",
                        "info"
                    );

                }

            }
        );

    });

}


/* =========================================================
   BACK BUTTON SUPPORT
   ========================================================= */

function setupBackButtons() {

    document
        .querySelectorAll(
            ".back-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    showPage("home");

                }
            );

        });

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            /*
                Ctrl + K
                Cmd + K
            */

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();


                showPage("explore");


                const search =
                    document.getElementById(
                        "search"
                    );


                if (search) {

                    setTimeout(
                        function () {

                            search.focus();

                        },
                        200
                    );

                }

            }


            /* ESC closes modal */

            if (
                event.key === "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".aura-modal"
                    )
                    .forEach(
                        function (modal) {

                            modal.remove();

                        }
                    );

            }

        }
    );

}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function createToastContainer() {

    if (
        document.querySelector(
            ".toast-container"
        )
    ) return;


    const container =
        document.createElement("div");


    container.className =
        "toast-container";


    document.body.appendChild(
        container
    );

}


function showToast(
    message,
    type = "info"
) {

    let container =
        document.querySelector(
            ".toast-container"
        );


    if (!container) {

        createToastContainer();

        container =
            document.querySelector(
                ".toast-container"
            );

    }


    const toast =
        document.createElement("div");


    toast.className =
        "toast " + type;


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                function () {

                    toast.remove();

                },
                300
            );

        },
        2500
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    /*
       Add a logout option dynamically
       to the Settings button.
    */

    const settings =
        document.querySelector(
            ".sidebar-bottom .nav-button"
        );


    if (!settings) return;


    settings.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Do you want to log out of Aura?"
                );


            if (!confirmLogout) return;


            localStorage.removeItem(
                "auraLoggedIn"
            );


            isLoggedIn = false;


            document
                .getElementById(
                    "application"
                )
                .classList.remove(
                    "active"
                );


            document
                .getElementById(
                    "login"
                )
                .style.display = "grid";


            document
                .getElementById(
                    "loginForm"
                )
                .reset();


            showToast(
                "You have been logged out",
                "info"
            );

        }
    );

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveAppState() {

    const likedPosts =
        [];


    document
        .querySelectorAll(
            ".like.liked"
        )
        .forEach(function (button, index) {

            likedPosts.push(index);

        });


    localStorage.setItem(
        "auraLikedPosts",
        JSON.stringify(
            likedPosts
        )
    );


    const savedPosts =
        [];


    document
        .querySelectorAll(
            ".save.saved"
        )
        .forEach(function (button, index) {

            savedPosts.push(index);

        });


    localStorage.setItem(
        "auraSavedPosts",
        JSON.stringify(
            savedPosts
        )
    );

}


function loadSavedState() {

    const logged =
        localStorage.getItem(
            "auraLoggedIn"
        );


    /*
       We intentionally keep login visible
       on refresh so this remains a simple
       front-end demo.
    */

    if (logged === "true") {

        /*
          Uncomment the following lines if you
          want automatic login after refresh.

          document.getElementById("login").style.display = "none";
          document.getElementById("application").classList.add("active");
          isLoggedIn = true;
        */

    }

}


/* =========================================================
   SECURITY / TEXT ESCAPING
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   DYNAMIC STYLES
   ========================================================= */

const dynamicStyles =
document.createElement("style");


dynamicStyles.textContent = `

/* ================= MODALS ================= */

.aura-modal {

    position: fixed;

    inset: 0;

    background: rgba(10, 6, 18, .72);

    backdrop-filter: blur(8px);

    z-index: 9999;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 20px;

}


.modal-box {

    position: relative;

    width: 100%;

    max-width: 480px;

    background: white;

    border-radius: 22px;

    padding: 30px;

    box-shadow:
        0 25px 80px rgba(0,0,0,.25);

    animation:
        modalIn .25s ease;

}


@keyframes modalIn {

    from {

        opacity: 0;

        transform: translateY(15px)
                   scale(.97);

    }

    to {

        opacity: 1;

        transform: translateY(0)
                   scale(1);

    }

}


.close-modal {

    position: absolute;

    right: 17px;

    top: 14px;

    width: 32px;

    height: 32px;

    border-radius: 50%;

    background: #f4f1f6;

    font-size: 21px;

    color: #77717f;

}


.close-modal:hover {

    background: #ece7f0;

}


.modal-box h2 {

    font-size: 22px;

    margin-bottom: 7px;

}


.modal-subtitle {

    font-size: 12px;

    color: #88818e;

    margin-bottom: 20px;

}


.modal-box textarea {

    width: 100%;

    height: 130px;

    resize: none;

    border: 1px solid #ebe8ef;

    border-radius: 14px;

    padding: 15px;

    outline: none;

    margin-bottom: 12px;

}


.modal-box input {

    width: 100%;

    height: 48px;

    border: 1px solid #ebe8ef;

    border-radius: 12px;

    padding: 0 14px;

    outline: none;

    margin-bottom: 14px;

}


.modal-box textarea:focus,
.modal-box input:focus {

    border-color: #7c3aed;

    box-shadow:
        0 0 0 4px #7c3aed12;

}


.modal-primary {

    width: 100%;

    height: 48px;

    border-radius: 13px;

    background:
        linear-gradient(
            135deg,
            #7c3aed,
            #a855f7
        );

    color: white;

    font-weight: 700;

}


/* ================= STORY VIEWER ================= */

.story-modal {

    background: #08050d;

}


.story-viewer {

    width: min(430px, 95vw);

    height: min(760px, 90vh);

    position: relative;

    border-radius: 24px;

    overflow: hidden;

    background: #17131e;

}


.story-viewer img {

    width: 100%;

    height: 100%;

    object-fit: cover;

}


.story-viewer::after {

    content: "";

    position: absolute;

    inset: 0;

    background:
        linear-gradient(
            transparent 65%,
            rgba(0,0,0,.7)
        );

    pointer-events: none;

}


.story-viewer .close-modal {

    z-index: 5;

    background: rgba(0,0,0,.45);

    color: white;

}


.story-user {

    position: absolute;

    z-index: 5;

    left: 22px;

    bottom: 28px;

    color: white;

    font-weight: 700;

    font-size: 13px;

}


.story-progress {

    position: absolute;

    z-index: 5;

    left: 15px;

    right: 15px;

    top: 15px;

    height: 3px;

    background: rgba(255,255,255,.35);

    border-radius: 10px;

}


.story-progress span {

    display: block;

    width: 100%;

    height: 100%;

    background: white;

    border-radius: 10px;

}


/* ================= COMMENTS ================= */

.comment-box {

    max-height: 650px;

}


.comments-area {

    max-height: 350px;

    overflow-y: auto;

    margin: 20px 0;

}


.comment {

    background: #f8f6fa;

    padding: 11px 13px;

    border-radius: 12px;

    margin-bottom: 9px;

}


.comment strong {

    font-size: 11px;

}


.comment p {

    font-size: 11px;

    color: #625c68;

    margin-top: 4px;

}


.comment-input {

    display: flex;

    gap: 8px;

}


.comment-input input {

    flex: 1;

    margin: 0;

}


.comment-input button {

    width: 70px;

    border-radius: 12px;

    background: #7c3aed;

    color: white;

    font-size: 11px;

    font-weight: 700;

}


/* ================= CHAT ================= */

.chat-box {

    max-width: 520px;

}


.chat-header {

    display: flex;

    align-items: center;

    gap: 10px;

    padding-bottom: 18px;

    border-bottom: 1px solid #ebe8ef;

}


.chat-header img {

    width: 43px;

    height: 43px;

    object-fit: cover;

    border-radius: 50%;

}


.chat-header div {

    display: flex;

    flex-direction: column;

}


.chat-header strong {

    font-size: 12px;

}


.chat-header small {

    font-size: 9px;

    color: #22a65a;

    margin-top: 3px;

}


.chat-messages {

    height: 330px;

    overflow-y: auto;

    padding: 20px 5px;

    display: flex;

    flex-direction: column;

    gap: 9px;

}


.chat-bubble {

    max-width: 72%;

    padding: 10px 13px;

    border-radius: 14px;

    font-size: 11px;

    line-height: 1.5;

}


.chat-bubble.received {

    align-self: flex-start;

    background: #f0edf4;

}


.chat-bubble.sent {

    align-self: flex-end;

    background: #7c3aed;

    color: white;

}


.chat-input {

    display: flex;

    gap: 8px;

    border-top: 1px solid #ebe8ef;

    padding-top: 15px;

}


.chat-input input {

    flex: 1;

    margin: 0;

}


.chat-input button {

    width: 48px;

    border-radius: 12px;

    background: #7c3aed;

    color: white;

}


/* ================= TOAST ================= */

.toast-container {

    position: fixed;

    right: 25px;

    bottom: 25px;

    z-index: 10000;

    display: flex;

    flex-direction: column;

    gap: 9px;

}


.toast {

    min-width: 220px;

    max-width: 330px;

    padding: 13px 16px;

    border-radius: 12px;

    background: #18151f;

    color: white;

    font-size: 11px;

    box-shadow:
        0 10px 30px rgba(0,0,0,.2);

    animation:
        toastIn .25s ease;

}


.toast.success {

    border-left: 4px solid #22c55e;

}


.toast.error {

    border-left: 4px solid #ef4444;

}


.toast.info {

    border-left: 4px solid #8b5cf6;

}


.toast.hide {

    opacity: 0;

    transform: translateX(20px);

    transition: .3s;

}


@keyframes toastIn {

    from {

        opacity: 0;

        transform: translateX(20px);

    }

    to {

        opacity: 1;

        transform: translateX(0);

    }

}


/* ================= MOBILE MODALS ================= */

@media(max-width:600px) {

    .modal-box {

        padding: 24px;

        border-radius: 19px;

    }


    .story-viewer {

        width: 100%;

        height: 90vh;

        border-radius: 18px;

    }


    .toast-container {

        left: 15px;

        right: 15px;

        bottom: 80px;

    }


    .toast {

        width: 100%;

        max-width: none;

    }

}

`;

document.head.appendChild(
    dynamicStyles
);


/* =========================================================
   END OF AURA JAVASCRIPT
   ========================================================= */