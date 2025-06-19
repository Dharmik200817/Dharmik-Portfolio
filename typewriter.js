// Text typing effect for the subtitle
// Learning JavaScript.
// Building Web Applications.
// exploring New Technologies.
// and learning to code.

const texts = [
  "Learning JavaScript.",
  "Building Web Applications.",
  "Eploring New Technologies.",
  "And learning to code.",
];

const typingText = document.getElementById("typing-text");

let currentTextIndex = 0;
let index = 0;
let isTyping = true;
let typingTimeout;

function type() {
  const currentText = texts[currentTextIndex];
  const visible = currentText.substring(0, index);
  // Add the blinking cursor span after the visible text
  typingText.innerHTML = visible + '<span class="blink-cursor"></span>' + '<span style="opacity:0;">' + currentText.substring(index) + '</span>';

  if (isTyping) {
    if (index < currentText.length) {
      index++;
      typingTimeout = setTimeout(type, 80);
    } else {
      typingTimeout = setTimeout(() => {
        isTyping = false;
        type();
      }, 5000); // Wait 5 seconds before erasing
    }
  } else {
    if (index > 0) {
      index--;
      typingTimeout = setTimeout(type, 40);
    } else {
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      isTyping = true;
      typingTimeout = setTimeout(type, 500);
    }
  }
}

function startTypingEffect() {
  clearTimeout(typingTimeout);
  typingText.innerHTML = "";
  currentTextIndex = 0;
  index = 0;
  isTyping = true;
  type();
}

document.addEventListener("DOMContentLoaded", startTypingEffect);
