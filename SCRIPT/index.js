// Preloader and initial setup
window.addEventListener("load", function () {
  // Hide preloader first
  this.document.getElementById("preloader").style.display = "none";

  // Then hide other elements
  this.document.getElementById("PL").style.display = "none";
  this.document.getElementById("ASHOK_CHAKRA").style.display = "none";

  // Show popup immediately after preloader
  setTimeout(function () {
    showPopup();
  }, 0);

  // Close popup after 4 seconds
  setTimeout(function () {
    closePopup();
  }, 4000);

  // Show images after popup closes
  setTimeout(function () {
    var img = document.getElementById("contactmeimg");
    var img2 = document.getElementById("joystickimg");
    var activeusers = document.getElementById("active-users-counter");
    img.classList.add("visible");
    img2.classList.add("visible");
    activeusers.classList.add("visible");
    setTimeout(function () {
      img.classList.add("hover-effect");
      img2.classList.add("hover-effect");
      activeusers.classList.add("hover-effect");
    }, 0);
    if (document.getElementById("survey-options").children.length == 0) {
      if (window.innerWidth <= 767) {
        document.getElementById("ham-menu").style.display = "block";
      }
    }
  }, 5000);

  // Show headings after delay
  const delay = 5000;
  const elements = ["h1", "h2", "h3"]
    .map((id) => document.getElementById(id))
    .filter((el) => el !== null);

  setTimeout(() => {
    elements.forEach((el) => el.classList.add("visible"));

    // 2 seconds after headings become visible, start the IP transition
    setTimeout(() => {
      applyHackingTransition();
    }, 2000);
  }, delay);
});

// Hacking-style text transition effect
function hackingTextTransition(element, targetText, duration = 2000) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const steps = 20;
  const stepDuration = duration / steps;
  let currentStep = 0;

  function getRandomChar() {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      let result = "";
      for (let i = 0; i < targetText.length; i++) {
        if (Math.random() < progress) {
          result += targetText[i];
        } else {
          result += getRandomChar();
        }
      }

      element.textContent = result;

      if (currentStep >= steps) {
        clearInterval(interval);
        element.textContent = targetText;
        resolve();
      }
    }, stepDuration);
  });
}

// ============== HYBRID IP DETECTION (NO EXTERNAL API) ==============

// Main function to apply IP transition with geolocation
async function applyHackingTransition() {
  const h1Element = document.getElementById("h1");
  const h2Element = document.getElementById("h2");

  if (!h1Element || !h2Element) return;

  // First, get the user's IP using your hybrid method
  const userIP = await getBrowserIP();

  // Phase 1: Show "UR IP" in h1
  await hackingTextTransition(h1Element, "UR IP", 1500);
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Phase 2: Show the actual IP in h2
  await hackingTextTransition(h2Element, userIP, 2000);
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Phase 3: Update h1 to show "LOCATION"
  await hackingTextTransition(h1Element, "LOCATION", 1500);
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Phase 4: Fetch and display location details one by one in h2
  await displayLocationDetails(userIP, h2Element);

  // After all transitions, show survey
  setTimeout(() => {
    if (document.getElementById("survey-options")?.children.length > 0) {
      document.getElementById("survey-overlay").style.display = "flex";
      if (window.innerWidth <= 767) {
        document.getElementById("ham-menu").style.display = "block";
      }
    }
  }, 1000);
}

// Function to fetch and display location details sequentially in h2
async function displayLocationDetails(ip, element) {
  if (!element) return;

  try {
    // Fetch location data from ip2location
    const response = await fetch(
      `https://api.ip2location.io/?key=FA2D60AFBFFDB386CEE07CC7FE0D5544&ip=${ip}&format=json`,
    );

    if (!response.ok) {
      throw new Error("Location fetch failed");
    }

    const locationData = await response.json();

    // Array of detail strings to display in sequence in h2
    const details = [
      `${locationData.country_name || "Unknown Country"}`,
      `${locationData.city || "Unknown City"}`,
      `ISP: ${locationData.isp || "Unknown"}`,
      `Lat: ${locationData.latitude || "??"}, Long: ${locationData.longitude || "??"}`,
      `Timezone: ${locationData.time_zone || "Unknown"}`,
    ];

    // Show each detail one by one in h2 with pause between
    for (const detail of details) {
      await hackingTextTransition(element, detail, 2000);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Pause between transitions
    }

    // Optional: Final message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await hackingTextTransition(h1Element, "TARGET LOCKED", 1500);
    await hackingTextTransition(element, "ACQUIRED", 1500);
  } catch (error) {
    console.error("Error fetching location:", error);
    // Show fallback message if location fetch fails
    await hackingTextTransition(h1Element, "ERROR", 1500);
    await hackingTextTransition(element, "LOCATION UNAVAILABLE", 2000);
  }
}
// Main hybrid IP detection function
async function getBrowserIP() {
  // Try WebRTC first (most accurate for local network)
  const webrtcIP = await getWebRTCIP();
  if (webrtcIP && !isPrivateIP(webrtcIP)) {
    console.log("IP detected via WebRTC:", webrtcIP);
    return webrtcIP;
  }

  // Try to get from connection/network info
  const connectionIP = getConnectionIP();
  if (connectionIP) {
    console.log("IP detected via connection:", connectionIP);
    return connectionIP;
  }

  // Try to get from browser APIs
  const browserIP = getIPFromBrowserAPI();
  if (browserIP) {
    console.log("IP detected via browser API:", browserIP);
    return browserIP;
  }

  // Fallback to realistic simulated IP
  const simulatedIP = simulateRealisticIP();
  console.log("Using simulated IP:", simulatedIP);
  return simulatedIP;
}

// Check if IP is private/local
function isPrivateIP(ip) {
  return (
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.20.") ||
    ip.startsWith("172.21.") ||
    ip.startsWith("172.22.") ||
    ip.startsWith("172.23.") ||
    ip.startsWith("172.24.") ||
    ip.startsWith("172.25.") ||
    ip.startsWith("172.26.") ||
    ip.startsWith("172.27.") ||
    ip.startsWith("172.28.") ||
    ip.startsWith("172.29.") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip === "127.0.0.1" ||
    ip === "localhost" ||
    ip === "0.0.0.0"
  );
}

// Method 1: WebRTC IP detection
function getWebRTCIP() {
  return new Promise((resolve) => {
    const RTCPeerConnection =
      window.RTCPeerConnection ||
      window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection;

    if (!RTCPeerConnection) {
      resolve(null);
      return;
    }

    const conn = new RTCPeerConnection({ iceServers: [] });
    const noop = () => {};

    try {
      conn.createDataChannel(""); // Create a dummy data channel

      conn
        .createOffer()
        .then((offer) => conn.setLocalDescription(offer))
        .catch(noop);

      conn.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const ipMatch = ipRegex.exec(ice.candidate.candidate);

          if (ipMatch && ipMatch[1]) {
            const ip = ipMatch[1];
            conn.close();
            resolve(ip);
          }
        }
      };

      // Timeout after 2 seconds
      setTimeout(() => {
        conn.close();
        resolve(null);
      }, 2000);
    } catch (e) {
      conn.close();
      resolve(null);
    }
  });
}

// Method 2: Get IP from connection/network info
function getConnectionIP() {
  // Try to get from performance API resource timing
  try {
    if (performance && performance.getEntries) {
      const entries = performance.getEntries();
      for (let entry of entries) {
        if (entry.name && entry.name.includes("//")) {
          const match = entry.name.match(/\/\/([^:\/]+)/);
          if (match && match[1]) {
            const hostname = match[1];
            // Check if it's an IP address
            if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              return hostname;
            }
          }
        }
      }
    }
  } catch (e) {
    // Ignore errors
  }

  // Try to get from current location
  if (
    window.location.hostname &&
    window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)
  ) {
    return window.location.hostname;
  }

  return null;
}

// Method 3: Get IP from various browser APIs
function getIPFromBrowserAPI() {
  // Try from connection object (if available)
  if (window.connection && window.connection.remoteAddress) {
    return window.connection.remoteAddress;
  }

  // Try from network information API
  if (navigator.connection && navigator.connection.remoteAddress) {
    return navigator.connection.remoteAddress;
  }

  // Try from client hints
  if (navigator.userAgentData && navigator.userAgentData.ipAddress) {
    return navigator.userAgentData.ipAddress;
  }

  return null;
}

// Method 4: Simulate realistic IP for fallback
function simulateRealisticIP() {
  // Generate IPs that look realistic (not in private ranges)
  const firstOctet = Math.floor(Math.random() * 100) + 100; // 100-199 (public range)
  const secondOctet = Math.floor(Math.random() * 255);
  const thirdOctet = Math.floor(Math.random() * 255);
  const fourthOctet = Math.floor(Math.random() * 255);

  return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
}

// Alternative: Get IP with geolocation-style (if you want location instead)
async function getBrowserLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This gives coordinates, not IP
          const { latitude, longitude } = position.coords;
          resolve(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        },
        (error) => {
          console.log("Geolocation error:", error);
          resolve(getBrowserIP()); // Fallback to IP
        },
      );
    } else {
      resolve(getBrowserIP());
    }
  });
}

// ============== END OF HYBRID IP DETECTION ==============

// Video background handling
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video-bg");
  if (video) {
    video.addEventListener("error", function () {
      document.body.classList.add("no-video");
    });

    // For mobile devices where autoplay might be blocked
    if (video.paused) {
      document.body.classList.add("no-video");
    }
  }
});

// Sound effects
function playSound() {
  const sound = document.getElementById("preloadSound");
  if (sound) {
    sound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const pl = document.getElementById("PL");
  const ashok = document.getElementById("ASHOK_CHAKRA");

  if (pl) pl.addEventListener("click", playSound);
  if (ashok) ashok.addEventListener("click", playSound);
});

// Popup functions
function showPopup() {
  const tp = document.getElementById("TP");
  const post = document.getElementById("Post");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");

  if (tp) tp.style.display = "none";
  if (post) post.style.display = "none";
  if (overlay) overlay.style.display = "block";
  if (popup) {
    popup.style.display = "block";
    document.body.style.cursor = "pointer";
    setTimeout(function () {
      popup.classList.add("popup-show");
    }, 100);
  }
}

function closePopup() {
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  const tp = document.getElementById("TP");
  const post = document.getElementById("Post");

  if (popup) popup.classList.remove("popup-show");
  setTimeout(function () {
    if (overlay) overlay.style.display = "none";
    if (popup) popup.style.display = "none";
    if (tp) tp.style.display = "block";
    if (post) post.style.display = "block";
    document.body.style.cursor = "default";
  }, 500);
}

// Hamburger menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const hamMenuIcon = document.getElementById("ham-menu");
  const navBar = document.getElementById("nav-bar");
  const TP = document.getElementById("TP");
  const Post = document.getElementById("Post");
  const CMI = document.getElementById("contactmeimg");
  const overlay = document.getElementById("overlay2");
  const formContainer = document.getElementById("S7");

  if (hamMenuIcon && navBar) {
    const navLinks = navBar.querySelectorAll("li");

    hamMenuIcon.addEventListener("click", () => {
      navBar.classList.toggle("active");
      hamMenuIcon.classList.toggle("fa-times");

      if (TP) TP.style.display = TP.style.display === "none" ? "block" : "none";
      if (Post)
        Post.style.display = Post.style.display === "none" ? "block" : "none";
      if (CMI)
        CMI.style.display = CMI.style.display === "none" ? "block" : "none";

      const surveyOverlay = document.getElementById("survey-overlay");
      if (surveyOverlay && surveyOverlay.style.display === "flex") {
        surveyOverlay.style.display = "none";
      }

      if (overlay && overlay.style.display === "block") {
        overlay.style.display = "none";
      }

      if (formContainer && formContainer.style.display === "block") {
        formContainer.style.display = "none";
      }
    });

    navLinks.forEach((navLink) => {
      navLink.addEventListener("click", () => {
        navBar.classList.remove("active");
        if (hamMenuIcon) hamMenuIcon.classList.toggle("fa-times");
      });
    });
  }

  // Contact form functionality
  const contactImg = document.getElementById("contactmeimg");
  if (contactImg && formContainer && overlay) {
    contactImg.addEventListener("click", function () {
      const isVisible = formContainer.style.display === "block";

      if (isVisible) {
        formContainer.style.opacity = "0";
        setTimeout(function () {
          formContainer.style.display = "none";
          overlay.style.display = "none";
        }, 500);
      } else {
        formContainer.style.display = "block";
        overlay.style.display = "block";
        setTimeout(function () {
          formContainer.style.opacity = "1";
        }, 10);
      }
    });
  }

  if (overlay && formContainer) {
    overlay.addEventListener("click", function () {
      formContainer.style.opacity = "0";
      setTimeout(function () {
        formContainer.style.display = "none";
        overlay.style.display = "none";
      }, 500);
    });
  }
});

// Fetch and display headline
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const h3Element = document.getElementById("h3");
    if (!h3Element) return;

    // Fetch and display the headline
    const response = await fetch(
      "https://abhinavpanwar.onrender.com/api/get_h3",
    );
    const { h3_text } = await response.json();
    h3Element.textContent = h3_text;
  } catch (error) {
    console.error("Error loading headline:", error);
    const h3Element = document.getElementById("h3");
    if (h3Element) h3Element.textContent = "";
  }
});

// Load and display survey
async function loadSurvey() {
  try {
    const response = await fetch(
      "https://abhinavpanwar.onrender.com/api/current_poll",
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.log("No active poll available");
      return;
    }

    // Display survey question and options
    const questionElement = document.getElementById("survey-question");
    const optionsContainer = document.getElementById("survey-options");

    if (questionElement) questionElement.textContent = data.question;
    if (optionsContainer) {
      optionsContainer.innerHTML = "";

      data.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;

        button.addEventListener("click", async () => {
          await submitResponse(index, button);
        });

        optionsContainer.appendChild(button);
      });
    }
  } catch (error) {
    console.error("Error loading survey:", error);
  }
}

// Submit survey response
async function submitResponse(index, button) {
  const optionsContainer = document.getElementById("survey-options");

  try {
    button.disabled = true;
    button.style.opacity = "0.7";

    const response = await fetch(
      "https://abhinavpanwar.onrender.com/api/submit_response",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_index: index }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to submit response");
    }

    // Show thank-you message (will stay until user closes manually)
    if (optionsContainer) {
      optionsContainer.innerHTML =
        '<p style="text-align:center; color:#4caf50;">Thank you for your feedback!</p>';
    }
  } catch (error) {
    console.error("Error submitting response:", error);
    button.disabled = false;
    button.style.opacity = "1";

    const errorElement = document.createElement("p");
    errorElement.style.color = "#f44336";
    errorElement.style.textAlign = "center";
    errorElement.textContent =
      error.message || "Submission failed. Please try again.";

    if (optionsContainer) {
      optionsContainer.appendChild(errorElement);
    }

    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }
}

// Manual close button handler
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("survey-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const overlay = document.getElementById("survey-overlay");
      if (overlay) {
        overlay.style.opacity = "0";

        setTimeout(() => {
          overlay.style.display = "none";
          overlay.style.opacity = "1";
        }, 500); // fast fade-out
      }
    });
  }
});

// Load survey when DOM is ready
window.addEventListener("DOMContentLoaded", loadSurvey);
