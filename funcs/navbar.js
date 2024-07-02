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
        <p id="first-name-last-name"> id="first-name-last-name"</p>
      </div>
      <ul>
        <li class="nav-item active">
          <a href="/profile">
            <i class="fa fa-user nav-icon"></i>
            <span class="nav-text">Profile</span>
          </a>
        </li>

        <li class="nav-item">
            <a href="/timeline">
              <i class="fa fa-arrow-trend-up nav-icon"></i>
              <span class="nav-text">Trending</span>
            </a>
        </li>

        <li class="nav-item">
            <a href="/prograss">
              <i class="fa fa-map nav-icon"></i>
              <span class="nav-text">Discover</span>
            </a>
        </li>
        <li class="nav-item">
          <a href="graphiql">
            <i class="fa-solid fa-chart-simple nav-icon"></i>
            <span class="nav-text">Analytics</span>
          </a>
        </li>

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

  // Function to update the active nav item based on the current URL
  const updateActiveNavItem = () => {
    const currentPath = window.location.pathname;
    navItems.forEach((navItem) => {
      const link = navItem.querySelector('a');
      // Assuming the href attribute is set correctly for each nav item
      if (link && link.getAttribute('href') === currentPath) {
        navItem.classList.add('active');
      } else {
        navItem.classList.remove('active');
      }
    });
  };

  // Call updateActiveNavItem to set the initial active item
  updateActiveNavItem();

  // Listen for click events on nav items to update the active class
  navItems.forEach((navItem) => {
    navItem.addEventListener("click", updateActiveNavItem);
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
      localStorage.setItem('theme', themeMode); // Save theme preference
      if (themeMode === 'dark') {
        // Apply dark mode classes and styles
        document.body.classList.add('darkmode');
      } else {
        // Remove dark mode classes and styles
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

    document.addEventListener('DOMContentLoaded', initialTheme);

    toggle.addEventListener('click', switchTheme);
    initialTheme();
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('darkmode');
    }
  });


  // const darkModeToggle = document.querySelector('#dark-mode-toggle'); // Assuming you have a toggle button

  // nightImage.addEventListener('click', () => {
  //   if (document.body.classList.contains('darkmode')) {
  //     disableDarkMode();
  //   } else {
  //     enableDarkMode();
  //   }
  // });

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

export function enableDarkMode() {
  document.body.classList.add('darkmode'); // Add darkmode class to body
  localStorage.setItem('darkMode', 'enabled'); // Save preference
}

export function disableDarkMode() {
  document.body.classList.remove('darkmode'); // Remove darkmode class from body
  localStorage.removeItem('darkMode'); // Clear preference
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