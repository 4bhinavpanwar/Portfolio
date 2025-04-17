// Mobile Menu Toggle
const hamMenuIcon = document.getElementById("ham-menu");
const navBar = document.getElementById("nav-bar");
const navLinks = navBar.querySelectorAll("li");

hamMenuIcon.addEventListener("click", () => {
  navBar.classList.toggle("active");
  hamMenuIcon.classList.toggle("fa-times");
});

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    navBar.classList.remove("active");
    hamMenuIcon.classList.remove("fa-times");
  });
});
