// BuildSpace shared interactions for auth, feed, and engagement buttons.

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupAuthTabs();
  setupAuthValidation();
  setupPostCreation();
  setupLikeButtons();
  setupToggleButtons(".event-interest-btn", "Interested", "Going");
  setupToggleButtons(".community-join-btn", "Join", "Joined");

  const yearNode = document.getElementById("currentYear");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
});

function setActiveNav() {
  const current = window.location.pathname.split("/").pop() || "dashboard.html";
  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    if (link.dataset.page === current) {
      link.classList.add("active");
    }
  });
}

function setupAuthTabs() {
  const loginTab = document.getElementById("showLogin");
  const signupTab = document.getElementById("showSignup");
  const loginFormWrap = document.getElementById("loginFormWrap");
  const signupFormWrap = document.getElementById("signupFormWrap");

  if (!loginTab || !signupTab || !loginFormWrap || !signupFormWrap) {
    return;
  }

  const activate = (mode) => {
    const loginMode = mode === "login";
    loginFormWrap.classList.toggle("d-none", !loginMode);
    signupFormWrap.classList.toggle("d-none", loginMode);
    loginTab.classList.toggle("btn-accent", loginMode);
    loginTab.classList.toggle("btn-outline-light", !loginMode);
    signupTab.classList.toggle("btn-accent", !loginMode);
    signupTab.classList.toggle("btn-outline-light", loginMode);
  };

  loginTab.addEventListener("click", () => activate("login"));
  signupTab.addEventListener("click", () => activate("signup"));
}

function setupAuthValidation() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const handleAuthSubmit = (form, mode) => {
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormErrors(form);

      const email = form.querySelector("input[type='email']");
      const password = form.querySelector("input[type='password']");
      let valid = true;

      if (!email || !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        showError(form, "Please enter a valid email address.");
        valid = false;
      }

      if (!password || password.value.trim().length < 6) {
        showError(form, "Password must be at least 6 characters.");
        valid = false;
      }

      if (mode === "signup") {
        const name = form.querySelector("input[name='fullName']");
        if (!name || name.value.trim().length < 2) {
          showError(form, "Please provide your full name.");
          valid = false;
        }
      }

      if (!valid) {
        return;
      }

      window.location.href = "dashboard.html";
    });
  };

  handleAuthSubmit(loginForm, "login");
  handleAuthSubmit(signupForm, "signup");
}

function clearFormErrors(form) {
  form.querySelectorAll(".form-note").forEach((node) => node.remove());
}

function showError(form, message) {
  const note = document.createElement("p");
  note.className = "form-note mt-2 mb-0";
  note.textContent = message;
  form.appendChild(note);
}

function setupPostCreation() {
  const form = document.getElementById("postForm");
  const input = document.getElementById("postContent");
  const feed = document.getElementById("feedContainer");

  if (!form || !input || !feed) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = input.value.trim();
    if (!content) {
      return;
    }

    const post = document.createElement("article");
    post.className = "surface-card post-card p-4 fade-in";
    post.innerHTML = `
      <div class="d-flex align-items-start gap-3 mb-3">
        <div class="profile-bubble">Y</div>
        <div>
          <h2 class="h5 mb-1">You</h2>
          <p class="text-muted mb-0">Just now</p>
        </div>
      </div>
      <p class="post-copy mb-3">${escapeHtml(content)}</p>
      <div class="post-actions pt-3">
        <button type="button" class="post-action like-btn">&#9825; 0</button>
        <button type="button" class="post-action">&#128172; 0</button>
        <button type="button" class="post-action">&#10227; Share</button>
      </div>
    `;

    feed.prepend(post);
    form.reset();
  });
}

function setupLikeButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".like-btn");
    if (!button) {
      return;
    }

    const liked = button.classList.toggle("active");

    if (button.classList.contains("post-action")) {
      const current = button.textContent.match(/\d+/);
      const count = current ? Number.parseInt(current[0], 10) : 0;
      const next = liked ? count + 1 : Math.max(count - 1, 0);
      button.innerHTML = `${liked ? "&#9829;" : "&#9825;"} ${next}`;
      return;
    }

    button.textContent = liked ? "Liked" : "Like";
    button.classList.toggle("btn-primary", liked);
    button.classList.toggle("btn-outline-light", !liked);
  });
}

function setupToggleButtons(selector, offText, onText) {
  document.querySelectorAll(selector).forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = btn.classList.toggle("active");
      btn.textContent = active ? onText : offText;
      btn.classList.toggle("btn-success", active);
      btn.classList.toggle("btn-outline-light", !active);
    });
  });
}

function escapeHtml(value) {
  const node = document.createElement("div");
  node.innerText = value;
  return node.innerHTML;
}
