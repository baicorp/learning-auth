import { Hono } from "hono";
import { htmlBuilder } from "../lib/html-components";
import userAuth from "../middleware/auth-middleware";
import { SESSION_TIME_SPAN_IN_SECONDS } from "../constant";

export const frontend = new Hono();

frontend.get("/", userAuth, async (c) => {
  const apiUrl = "http://localhost:3000/api/auth/current-user"; // fallback
  const res = await fetch(apiUrl, {
    headers: {
      cookie: c.req.raw.headers.get("cookie") ?? "", // forward cookies
    },
  });
  if (res.status !== 200) {
    return c.redirect("/");
  }
  const data = await res.json();
  return c.html(
    htmlBuilder({
      title: data.name,
      description: `Hello friends my name is ${data.name}`,
      children: `
      <main class="h-dvh flex flex-col justify-center items-center gap-5">
        <h1 class="text-xl md:text-3xl text-center font-extrabold absolute top-20 left-1/2 -translate-x-1/2">
          This page is protected, only for authenticated user
        </h1>
        <p class="text-center">
          Browse freely between home and about page. Inactive for <span id="time-span">${SESSION_TIME_SPAN_IN_SECONDS}</span> seconds?
          You'll be logged out automatically.
        </p>
        <div class="flex items-center gap-4 p-4 border border-gray-300 rounded-xl transition-all hover:shadow-md hover:shadow-gray-300">
          <img
            src=${data?.picture}
            alt="profile-picture"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <p class="font-extrabold text-xl">${data?.name}</p>
            <p class="font-semibold text-gray-500">${data?.email}</p>
          </div>
        </div>
        <a
          href="/about"
          class="bg-black text-white font-semibold px-3 py-2 border border-slate-900 rounded-lg hover:bg-gray-800"
        >
          About
        </a>
        <button
          id="logout-btn"
          class="bg-red-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-600 mt-10"
        >
          Logout
        </button>
        <script type="module">
          async function logout(){
            try {
              const res = await fetch("/api/auth/logout");
              const logout = await res.json();
              window.location.replace("/sign-in");
            } catch (e) {
              return { success: false };
            }
          }
          const logoutBtn = document.getElementById("logout-btn");
          const timeSpan = document.getElementById("time-span")
          
          const intervalId = setInterval(() => {
            const currentTime = parseInt(timeSpan.textContent);

            if (currentTime <= 1) {
              timeSpan.textContent = "0";
              clearInterval(intervalId); // stop the interval
              window.location.reload()
            } else {
              timeSpan.textContent = currentTime - 1;
            }
          }, 1000);
        
          logoutBtn.addEventListener("click", logout)
        </script>
      </main>`,
    })
  );
});

frontend.get("/sign-in", async (c) => {
  const apiUrl = "http://localhost:3000/api/auth/current-user"; // fallback
  const res = await fetch(apiUrl, {
    headers: {
      cookie: c.req.raw.headers.get("cookie") ?? "", // forward cookies
    },
  });
  if (res.status === 200) {
    return c.redirect("/");
  }
  return c.html(
    htmlBuilder({
      title: "sign-in",
      description: "please sign in",
      children: `
      <main class="h-dvh flex flex-col justify-center items-center gap-4">
      <div class="flex flex-col gap-2">
        <button
          id="google-btn"
          class="border border-gray-300 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2 hover:bg-gray-50"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 48 48"
          viewBox="0 0 48 48"
          class="w-6 h-6"
        >
          <path
            d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-11.045 0-20 8.955-20 20s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            fill="#ffc107"
          />
          <path
            d="m6.306 14.691 6.571 4.819c1.778-4.402 6.084-7.51 11.123-7.51 3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-7.682 0-14.344 4.337-17.694 10.691z"
            fill="#ff3d00"
          />
          <path
            d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.521-4.504 2.43-7.219 2.43-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025c3.31 6.477 10.032 10.921 17.805 10.921z"
            fill="#4caf50"
          />
          <path
            d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238c-.438.398 6.591-4.807 6.591-14.807 0-1.341-.138-2.65-.389-3.917z"
            fill="#1976d2"
          />
          </svg>
          <span>Continue with Google</span>
        </button>
        <button
          id="github-btn"
          class="border border-gray-300 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2 hover:bg-gray-50"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="#000"
          >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span>Continue with Github</span>
        </button>
      </div>  
      <p class="text-neutral-600 font-semibold">Or</p>
      <form id="signup-form" class="flex flex-col gap-2">
        <div>
          <label for="email" class="block text-gray-500 text-sm font-semibold">Email</label>
          <input type="email" id="email" name="email" class="shadow appearance-none border rounded w-[252px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div>
          <label for="password" class="block text-gray-500 text-sm font-semibold">Password</label>
          <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-[252px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div id="error-message" class="text-red-500 text-xs hidden"></div>
        <button id="submit-btn" type="submit" class="mt-2 bg-neutral-950 hover:bg-neutral-700 text-white font-bold py-1.5 px-5 rounded focus:outline-none focus:shadow-outline">
          Sign In
        </button>
      </form>
      <div class="flex items-center gap-1">
        <p>Don't have an account ?</p>
        <a class="text-blue-600 font-semibold" href="/sign-up">sign up</a>
      </div>
      <script type="module">
        const form = document.getElementById("signup-form");
        const submitBtn = document.getElementById("submit-btn");
        const errorMessage = document.getElementById("error-message");
        const googleBtn = document.getElementById("google-btn");
        const githubBtn = document.getElementById("github-btn");
        
        async function handleClickOAuth(provider) {
          const res = await fetch(
            \`\${window.location.origin}/api/auth/oauth/\${provider}/getConcentScreen\`
          );

          if (res.status !== 200) {
            window.alert("Something went wrong (res)");
            return;
          }

          const data = await res.json();
          if (!data?.url) {
            window.alert("Something went wrong (data)");
            return;
          }

          const width = 500;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;

          window.open(
            data.url,
            "oauthWindow",
            \`width=\${width},height=\${height},top=\${top},left=\${left}\`
          );
        }

        googleBtn.addEventListener("click", () => {
          handleClickOAuth("google")
        });
        githubBtn.addEventListener("click", () => {
          handleClickOAuth("github")
        });

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          submitBtn.setAttribute("disabled", true)
          errorMessage.classList.add('hidden');

          const formData = new FormData(e.currentTarget);
          const email = formData.get("email");
          const password = formData.get("password");

          if (email.trim() === '' || password.trim() === '') {
            errorMessage.textContent = 'All fields are required.';
            errorMessage.classList.remove('hidden');
            submitBtn.removeAttribute("disabled")
            return;
          }

          try {
            const res = await fetch("http://localhost:3000/api/auth/session/sign-in", 
            {
              method: "POST",
              body: JSON.stringify({email, password})
            });
            const result = await res.json();
            if(result.success){
              submitBtn.removeAttribute("disabled")
              window.location.replace("/")
            } else{
              throw new Error(res.status + ":" + result.message);
            }
          } catch (error) {
            submitBtn.removeAttribute("disabled")
            window.alert(error.message)
          }
        })
        window.addEventListener("message", (event) => {
          if (event.data?.type === "oauth-success") {
            // Redirect to home page after OAuth login
            window.location.replace("/");
          }
        });
      </script>
    </main>`,
    })
  );
});

frontend.get("/sign-up", async (c) => {
  const apiUrl = "http://localhost:3000/api/auth/current-user"; // fallback
  const res = await fetch(apiUrl, {
    headers: {
      cookie: c.req.raw.headers.get("cookie") ?? "", // forward cookies
    },
  });
  if (res.status === 200) {
    return c.redirect("/");
  }
  return c.html(
    htmlBuilder({
      title: "sign-up",
      description: "please sign up",
      children: `
    <main class="h-dvh flex flex-col justify-center items-center gap-4">
      <div class="flex flex-col gap-2">
        <button
          id="google-btn"
          class="border border-gray-300 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2 hover:bg-gray-50"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 48 48"
          viewBox="0 0 48 48"
          class="w-6 h-6"
        >
          <path
            d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-11.045 0-20 8.955-20 20s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            fill="#ffc107"
          />
          <path
            d="m6.306 14.691 6.571 4.819c1.778-4.402 6.084-7.51 11.123-7.51 3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-7.682 0-14.344 4.337-17.694 10.691z"
            fill="#ff3d00"
          />
          <path
            d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.521-4.504 2.43-7.219 2.43-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025c3.31 6.477 10.032 10.921 17.805 10.921z"
            fill="#4caf50"
          />
          <path
            d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238c-.438.398 6.591-4.807 6.591-14.807 0-1.341-.138-2.65-.389-3.917z"
            fill="#1976d2"
          />
          </svg>
          <span>Continue with Google</span>
        </button>
        <button
          id="github-btn"
          class="border border-gray-300 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2 hover:bg-gray-50"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="#000"
          >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span>Continue with Github</span>
        </button>
      </div>  
      <p class="text-neutral-600 font-semibold">Or</p>
      <form id="signup-form" class="flex flex-col gap-2">
        <div>
          <label for="name" class="block text-gray-500 text-sm font-semibold">Name</label>
          <input type="text" id="name" name="name" class="shadow appearance-none border rounded w-[252px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div>
          <label for="email" class="block text-gray-500 text-sm font-semibold">Email</label>
          <input type="email" id="email" name="email" class="shadow appearance-none border rounded w-[252px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div>
          <label for="password" class="block text-gray-500 text-sm font-semibold">Password</label>
          <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-[252px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div>
          <label for="repeat_password" class="block text-gray-500 text-sm font-semibold">Repeat Password</label>
          <input type="password" id="repeat_password" name="repeat_password" class="shadow appearance-none border rounded w-[252px] py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div id="error-message" class="text-red-500 text-xs hidden"></div>
        <button id="submit-btn" type="submit" class="bg-neutral-950 hover:bg-neutral-700 text-white font-bold py-1.5 px-5 rounded focus:outline-none focus:shadow-outline">
          Sign Up
        </button>
      </form>
      <div class="flex items-center gap-1">
        <p>Already have an account ?</p>
        <a class="text-blue-600 font-semibold" href="/sign-in">sign in</a>
      </div>
      <script type="module">
        const form = document.getElementById("signup-form");
        const submitBtn = document.getElementById("submit-btn");
        const errorMessage = document.getElementById("error-message");
        const googleBtn = document.getElementById("google-btn");
        const githubBtn = document.getElementById("github-btn");
        
        async function handleClickOAuth(provider) {
          const res = await fetch(
            \`\${window.location.origin}/api/auth/oauth/\${provider}/getConcentScreen\`
          );

          if (res.status !== 200) {
            window.alert("Something went wrong (res)");
            return;
          }

          const data = await res.json();
          if (!data?.url) {
            window.alert("Something went wrong (data)");
            return;
          }

          const width = 500;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;

          window.open(
            data.url,
            "oauthWindow",
            \`width=\${width},height=\${height},top=\${top},left=\${left}\`
          );
        }

        googleBtn.addEventListener("click", () => {
          handleClickOAuth("google")
        });
        githubBtn.addEventListener("click", () => {
          handleClickOAuth("github")
        });

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          submitBtn.setAttribute("disabled", true)
          errorMessage.classList.add('hidden');

          const formData = new FormData(e.currentTarget);
          const userName = formData.get("name");
          const email = formData.get("email");
          const password = formData.get("password");
          const repeatPassword = formData.get("repeat_password");

          if (userName.trim() === '' || email.trim() === '' || password.trim() === '' || repeatPassword.trim() === '') {
            errorMessage.textContent = 'All fields are required.';
            errorMessage.classList.remove('hidden');
            submitBtn.removeAttribute("disabled")
            return;
          }

          if (password !== repeatPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            errorMessage.classList.remove('hidden');
            submitBtn.removeAttribute("disabled")
            return;
          }

          try {
            const res = await fetch("http://localhost:3000/api/auth/session/sign-up", 
            {
              method: "POST",
              body: JSON.stringify({name: userName, email, password, repeatPassword})
            });
            const result = await res.json();
            if(result.success){
              submitBtn.removeAttribute("disabled")
              window.location.replace("/")
            } else{
              throw new Error(res.status + ":" + result.message);
            }
          } catch (error) {
            submitBtn.removeAttribute("disabled")
            window.alert(error.message)
          }
        })
        window.addEventListener("message", (event) => {
          if (event.data?.type === "oauth-success") {
            // Redirect to home page after OAuth login
            window.location.replace("/");
          }
        });
      </script>
    </main>`,
    })
  );
});

frontend.get("/about", userAuth, (c) => {
  return c.html(
    htmlBuilder({
      children: `
      <main class="h-dvh flex flex-col justify-center items-center gap-5">
        <h1 class="text-xl md:text-3xl text-center font-extrabold absolute top-20 left-1/2 -translate-x-1/2">
          This is About page (protected)
        </h1>
        <p class="text-center">
          Browse freely between home and about page. Inactive for <span id="time-span">${SESSION_TIME_SPAN_IN_SECONDS}</span> seconds?
          You'll be logged out automatically.
        </p>
        <a
          href="/"
          class="bg-black text-white font-semibold px-3 py-2 border border-slate-900 rounded-lg hover:bg-gray-800"
        >
          Home
        </>
        <script type="module">
          const timeSpan = document.getElementById("time-span")
          const intervalId = setInterval(() => {
          const currentTime = parseInt(timeSpan.textContent);

          if (currentTime <= 1) {
            timeSpan.textContent = "0";
            clearInterval(intervalId); // stop the interval
          } else {
            timeSpan.textContent = currentTime - 1;
          }
        }, 1000);
        </script>
      </main>`,
    })
  );
});
