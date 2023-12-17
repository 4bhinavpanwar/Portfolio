const textContainer = document.querySelector(".text-container");
const texts = document.querySelectorAll(".text");
let currentIndex = 0;

function toggleText() {
  const currentText = texts[currentIndex];
  const nextIndex = (currentIndex + 1) % texts.length;
  const nextText = texts[nextIndex];

  // Remove the flip class from the current text
  currentText.classList.remove("flip");

  // Add the flip class to the next text after a small delay to trigger the flip animation
  setTimeout(() => {
    nextText.classList.add("flip");
  }, 10); // A small delay to ensure the flip animation applies

  currentIndex = nextIndex;
}

// Toggle the text every 2 seconds (2000 milliseconds)
setInterval(toggleText, 2000);

let b = document.getElementById("footimg1");
document.body.addEventListener("keydown", (press) => {
  if (press.key == "Escape") {
    window.location.href = "../index.html";
  }
});

const container = document.getElementById("body");
const divs = document.querySelectorAll(".a");

let currentIndeX = 0;

function scrollToIndex(index) {
  if (index >= 0 && index < divs.length) {
    divs[currentIndeX].classList.remove("highlighted");
    currentIndeX = index;
    divs[currentIndeX].classList.add("highlighted");
    divs[currentIndeX].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

// body.addEventListener("click",function()=> {

// })

container.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && currentIndeX == 0) {
    window.open(
      "https://abhinavpanwar.github.io/STONE_PAPER_SCISSORS/",
      "_blank"
    );
  }
  if (event.key == "Enter" && currentIndeX == 1) {
    window.open("https://abhinavpanwar.github.io/2023_WC_SCHEDULE/", "_blank");
  }
  if (event.key == "Enter" && currentIndeX == 2) {
    window.open(
      "https://abhinavpanwar.github.io/FOOD_ORDERING_WEBSITE/FOOD_ORDERING_WEBSITE",
      "_blank"
    );
  }
  if (event.key == "Enter" && currentIndeX == 3) {
    window.open(
      "https://abhinavpanwar.github.io/AMAZON_PRIME_CLONE/",
      "_blank"
    );
  }
  if (event.key == "Enter" && currentIndeX == 4) {
    window.open("https://utkarshpanwar-ap.netlify.app/", "_blank");
  }
  if (event.key == "Enter" && currentIndeX == 5) {
    window.open("https://kingofcards.netlify.app/", "_blank");
  }
  if (event.key == "Enter" && currentIndeX == 6) {
    window.open("https://abhinavpanwar.github.io/world_clock/", "_blank");
  }
  if (event.key == "Enter" && currentIndeX == 7) {
    window.open("https://abhinavpanwar.github.io/calculator/", "_blank");
  }
  if (event.key == "Enter" && currentIndeX == 8) {
    window.open("https://abhinavpanwar.github.io/AOT_QUIZ/", "_blank");
  }
  if (event.key == "Enter" && currentIndeX == 9) {
    window.open("https://abhinavpanwar.github.io/BILL/", "_blank");
  }
  if (event.key === "ArrowUp") {
    scrollToIndex(currentIndeX - 1);
  } else if (event.key === "ArrowDown") {
    scrollToIndex(currentIndeX + 1);
  }
});

// Initial highlighting
divs[currentIndeX].classList.add("highlighted");
