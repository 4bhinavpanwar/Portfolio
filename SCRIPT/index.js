window.addEventListener("load", function () {
  this.document.getElementById("preloader").style.display = "none";
  this.document.getElementById("PL").style.display = "none";
  this.document.getElementById("ASHOK_CHAKRA").style.display = "none";
});

function showPopup() {
  TP.style.display = "none";
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
    document.body.style.cursor = "default";
  }, 500);
}

setTimeout(function () {
  showPopup();
}, 2500);

function myEventHandler() {
  closePopup();
}

document.addEventListener("click", myEventHandler, { once: true });

let hamMenuIcon = document.getElementById("ham-menu");
let navBar = document.getElementById("nav-bar");
let navLinks = navBar.querySelectorAll("li");
let TP = document.getElementById("TP");

hamMenuIcon.addEventListener("click", () => {
  navBar.classList.toggle("active");
  hamMenuIcon.classList.toggle("fa-times");
  TP.style.display = TP.style.display === "none" ? "block" : "none";
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
