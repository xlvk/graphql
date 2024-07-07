import user from "../assets/user2.png";

/**
 * Renders Navbar based on the if the user is logged in or
 * not
 *
 * @returns Navbar HTML
 */

export const LoadNav = () => {
    return /*html*/ `
  <nav class="main-menu">
    <div>
      <div class="user-info">
        <img
          src="${user}"
          alt="user" />
        <p id="wlcoming">User</p>
      </div>
      <ul>
        <li class="nav-item active">
          <a href="/profile">
            <i class="fa fa-user nav-icon"></i>
            <span class="nav-text">Profile</span>
          </a>
        </li>

        <!-- <li class="nav-item">
          <a href="graphiql">
            <i class="fa-solid fa-chart-simple nav-icon"></i>
            <span class="nav-text">Analytics</span>
          </a>
        </li> -->

        <!-- <li class="nav-item">
          <a href="#">
            <i class="fa fa-arrow-trend-up nav-icon"></i>
            <span class="nav-text">Trending</span>
          </a>
        </li> -->
        <li class="nav-item">
          <div class="interaction-control interactions">
            <div class="toggle" onclick="switchTheme()">
              <div class="mode-icon moon">
                <i class="bx bxs-moon night-img"></i>
              </div>
              <div class="mode-icon sun hidden">
                <i class="bx bxs-sun morning-img"></i>
              </div>
            </div>
          </div>
        </li>
        <!-- <li class="nav-item">
          <a href="#">
            <i class="fa fa-heart nav-icon"></i>
            <span class="nav-text">Favorites</span>
          </a>
        </li> -->

      </ul>
    </div>

    <ul>
      <li class="nav-item">
        <a href="/logout">
          <i class="fa fa-right-from-bracket nav-icon"></i>
          <span class="nav-text">Logout</span>
        </a>
      </li>
    </ul>
  </nav>
    `;
};

/**
 * to handle the dark mode btn and the movment in the navbar
 */
export function navBarItems() {
    //! Active Navbar Item

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((navItem, i) => {
      navItem.addEventListener("click", () => {
        navItems.forEach((item, j) => {
          item.className = "nav-item";
        });
        navItem.className = "nav-item active";
      });
    });
  
    //! Light/Dark Mode
    const sunIcon = document.querySelector('.sun');
    const moonIcon = document.querySelector('.moon');
    const morningImage = document.querySelector('.morning-img');
    const nightImage = document.querySelector('.night-img');
    const toggle = document.querySelector('.toggle');
    document.addEventListener('DOMContentLoaded', function () {
  
      window.switchTheme = function () {
        document.body.classList.toggle('darkmode');
        if (document.body.classList.contains('darkmode')) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
          morningImage.classList.remove('hidden');
          nightImage.classList.add('hidden');
          localStorage.setItem('theme', 'dark');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
          morningImage.classList.add('hidden');
          nightImage.classList.remove('hidden');
          localStorage.setItem('theme', 'light');
        }
      }
  
      function updateTheme(themeMode) {
        if (themeMode === 'dark') {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
          morningImage.classList.add('hidden');
          nightImage.classList.remove('hidden');
          document.body.classList.add('darkmode');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
          morningImage.classList.add('hidden');
          nightImage.classList.remove('hidden');
          document.body.classList.remove('darkmode');
        }
      }
  
      function initialTheme() {
        const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
        const storedTheme = localStorage.getItem('theme');
  
        if (storedTheme === 'dark' || (storedTheme === null && prefersDarkTheme.matches)) {
          updateTheme('dark');
        } else {
          updateTheme('light');
        }
      }
  
      toggle.addEventListener('click', switchTheme);
      initialTheme();
    });
  
    window.switchTheme = function () {
      document.body.classList.toggle('darkmode');
      if (document.body.classList.contains('darkmode')) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        morningImage.classList.remove('hidden');
        nightImage.classList.add('hidden');
        localStorage.setItem('theme', 'dark');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        morningImage.classList.add('hidden');
        nightImage.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
      }
    }
}

export const LoadFooter = () => {
  return /*html*/ `
    <footer>
      <div class="footer">
        <div class="footer-logo">
          <img src="../assets/logo.svg" alt="logo">
        </div>
        <div class="footer-text">
          <p>&copy; 2024 Fatima. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}