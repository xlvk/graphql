// import { HandleLogin } from "../../funcs/auth";
import { Alphabet } from "../../funcs/MyAlphabet";
import Auth from "./login.tsx";

export const Login = () => {
  document.getElementById("app").innerHTML = /* html */ `
  <div class="container_sign right-panel-active">
  <!-- Sign Up -->
  <div class="container_sign__form container_sign--signup">
      <form action="#" class="form" id="form1">
          <h2 class="form__title">For Sign Up </br> you need to go to Reboot's original website.</h2>
          <button class="btn" id="signUpPale">Sign Up</button>
      </form>
  </div>

  <!-- Sign In -->
  <div class="container_sign__form container_sign--signin">
      <form action="#" class="form" id="form2">
          <h2 class="form__title">Sign In</h2>
          <input type="email" placeholder="Email" class="input" id="email"/>
          <input type="password" placeholder="Password" class="input" id="password"/>
          <a href="#" class="link">Forgot your password?</a>
          <button class="btn" id="signInPale" method="POST" onSubmit={Auth}>Sign In</button>
      </form>
  </div>

  <!-- Overlay -->
  <div class="container_sign__overlay">
      <div class="overlay">
          <div class="overlay__panel overlay--left">
              <button class="btn" id="signIn">Sign In</button>
          </div>
          <div class="overlay__panel overlay--right">
              <button class="btn" id="signUp">Sign Up</button>
          </div>
      </div>
  </div>
</div>
  `;

  const signInBtn = document.getElementById("signIn");
  const signUpBtn = document.getElementById("signUp");
  const signInBtnPale = document.getElementById("signInPale");
  const signUpBtnPale = document.getElementById("signUpPale");
  const fistForm = document.getElementById("form1");
  const secondForm = document.getElementById("form2");
  const container_sign = document.querySelector(".container_sign");

  console.log(signInBtn);
  signInBtn.addEventListener("click", () => {
      container_sign.classList.remove("right-panel-active");
  });

  console.log(signUpBtn);
  signUpBtn.addEventListener("click", () => {
    container_sign.classList.add("right-panel-active");
  });

  console.log(signInBtnPale);
  // signInBtnPale.addEventListener("click", () => {
  //   // call of the function
  // });
  // Add event listener for click event and call the handler function
  signInBtnPale.addEventListener("click", Auth);

  console.log(signUpBtnPale);
  signUpBtnPale.addEventListener("click", () => {
    window.location.href = Alphabet.A;
  });

  fistForm.addEventListener("submit", (e) => e.preventDefault());
  secondForm.addEventListener("submit", (e) => e.preventDefault());

  // document
  //   .getElementById("submit")
  //   .addEventListener("click", async () => await HandleLogin());
  // document.addEventListener("keydown", (event) => {
  //   if (event.key.toLowerCase() === "enter") {
  //     document.getElementById("submit").click();
  //   }
  // });
  // const svg = document.getElementById("authlogo");
  // let degree = 0;

  // function animate() {
  //   degree++;
  //   if (degree === 360) {
  //     degree = 0;
  //   }
  //   svg.style.transform = `rotateY(${degree}deg)`;
  //   requestAnimationFrame(animate);
  // }

  // animate();
};
