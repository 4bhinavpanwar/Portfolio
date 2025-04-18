// Play sound on click
function playSound() {
  document
    .getElementById("preloadSound")
    .play()
    .catch((error) => {
      console.error("Error playing sound:", error);
    });
}

document.getElementById("PL").addEventListener("click", playSound);
document.getElementById("ASHOK_CHAKRA").addEventListener("click", playSound);

function showPopup() {
  TP.style.display = "none";
  if (window.innerWidth <= 767) {
    document.getElementById("ham-menu").style.display = "none";
  }
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
  document.body.style.cursor = "pointer";
  setTimeout(function () {
    document.getElementById("popup").classList.add("popup-show");
  }, 100);
}

function closePopup() {
  document.getElementById("popup").classList.remove("popup-show");
  setTimeout(function () {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
    TP.style.display = "block";
    if (window.innerWidth <= 767) {
      document.getElementById("ham-menu").style.display = "block";
    }
    document.body.style.cursor = "default";
  }, 500);
}

window.addEventListener("load", function () {
  this.document.getElementById("preloader").style.display = "none";
  this.document.getElementById("PL").style.display = "none";
  this.document.getElementById("ASHOK_CHAKRA").style.display = "none";

  setTimeout(function () {
    showPopup();
  }, 1000);

  setTimeout(function () {
    closePopup();
  }, 4000);

  setTimeout(function () {
    var img = document.getElementById("contactmeimg");
    var img2 = document.getElementById("joystickimg");
    img.classList.add("visible");
    img2.classList.add("visible");
    setTimeout(function () {
      img.classList.add("hover-effect");
      img2.classList.add("hover-effect");
    }, 0); // Delay before starting hover effect
  }, 5000); // Delay of 500ms before popping up

  // Time delay in milliseconds (e.g., 2000ms = 2 seconds)
  const delay = 5000;

  // Select elements by their IDs
  const elements = ["h1", "h2"]
    .map((id) => document.getElementById(id)) // Map to DOM elements
    .filter((el) => el !== null); // Filter out null values

  // Apply 'visible' class after the delay
  setTimeout(() => {
    elements.forEach((el) => el.classList.add("visible"));
  }, delay);
});

let hamMenuIcon = document.getElementById("ham-menu");
let navBar = document.getElementById("nav-bar");
let navLinks = navBar.querySelectorAll("li");
let TP = document.getElementById("TP");
let CMI = document.getElementById("contactmeimg");
var overlay = document.getElementById("overlay2");
var formContainer = document.getElementById("S7");

hamMenuIcon.addEventListener("click", () => {
  navBar.classList.toggle("active");
  hamMenuIcon.classList.toggle("fa-times");
  TP.style.display = TP.style.display === "none" ? "block" : "none";
  CMI.style.display = CMI.style.display === "none" ? "block" : "none";
  if (overlay.style.display === "block") {
    overlay.style.display = "none";
  }
  if (formContainer.style.display === "block") {
    formContainer.style.display = "none";
  }
});
navLinks.forEach((navLinks) => {
  navLinks.addEventListener("click", () => {
    navBar.classList.remove("active");
    hamMenuIcon.classList.toggle("fa-times");
  });
});

const parallax_el = document.querySelectorAll(".Parallax");
let xValue = 0,
  yValue = 0;
let rotateDegree = 0;

function update(cursorPosition) {
  parallax_el.forEach((el) => {
    let speedx = el.dataset.speedx;
    let speedy = el.dataset.speedy;
    let speedz = el.dataset.speedz;
    let rotateSpeed = el.dataset.rotation;

    let isInLeft =
      parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
    let zValue =
      cursorPosition - parseFloat(getComputedStyle(el).left) * isInLeft * 0.1;

    el.style.transform = ` rotateY(${
      rotateDegree * rotateSpeed
    }deg) translateX(calc(-50% + ${
      -xValue * speedx
    }px)) translateY(calc(-50% + ${
      yValue * speedy
    }px)) perspective(2300px) translateZ(${zValue * speedz}px)`;
  });
}

update(0);

window.addEventListener("mousemove", (e) => {
  xValue = e.clientX - window.innerWidth / 2;
  yValue = e.clientY - window.innerHeight / 2;
  rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

  update(e.clientX);
});

// contactme

document.getElementById("contactmeimg").addEventListener("click", function () {
  var isVisible = formContainer.style.display === "block";

  if (isVisible) {
    formContainer.style.opacity = "0";
    setTimeout(function () {
      formContainer.style.display = "none";
      overlay.style.display = "none";
    }, 500); // Match this with the transition duration
  } else {
    formContainer.style.display = "block";
    overlay.style.display = "block";
    setTimeout(function () {
      formContainer.style.opacity = "1";
    }, 10); // Slight delay to ensure the display change takes effect
  }
});

document.getElementById("overlay2").addEventListener("click", function () {
  var overlay = document.getElementById("overlay2");
  var formContainer = document.getElementById("S7");

  formContainer.style.opacity = "0";
  setTimeout(function () {
    formContainer.style.display = "none";
    overlay.style.display = "none";
  }, 500); // Match this with the transition duration
});
