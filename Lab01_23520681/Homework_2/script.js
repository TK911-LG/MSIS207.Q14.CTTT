// Function to play sound based on the key pressed or clicked
function playSound(key) {
  // This switch statement has been updated to match your .wav files
  switch (key) {
    case 'w':
      var hiHat = new Audio('sounds/hi-hat.wav'); // Corrected to hi-hat.wav
      hiHat.play();
      break;
    case 'a':
      var clap = new Audio('sounds/clap.wav'); // Corrected to clap.wav
      clap.play();
      break;
    case 's':
      var snare = new Audio('sounds/snare.wav'); // Corrected to snare.wav
      snare.play();
      break;
    case 'd':
      var kick = new Audio('sounds/kick.wav'); // Corrected to kick.wav
      kick.play();
      break;
    case 'j':
      var perc1 = new Audio('sounds/perc_1.wav'); // Using perc_1.wav
      perc1.play();
      break;
    case 'k':
      var perc2 = new Audio('sounds/perc_2.wav'); // Using perc_2.wav
      perc2.play();
      break;
    case 'l':
      var bass808 = new Audio('sounds/808.wav'); // Corrected to 808.wav
      bass808.play();
      break;
    default:
      // Does nothing if a different key is pressed
      console.log(key);
  }
}

// Function to add a visual "pressed" effect to the button
function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  // Check if the button exists to prevent errors
  if (activeButton) {
    activeButton.classList.add("pressed");
    // Remove the effect after a short delay
    setTimeout(function() {
      activeButton.classList.remove("pressed");
    }, 100);
  }
}

// Add click listeners to all buttons with the "drum" class
var drumButtons = document.querySelectorAll(".drum");
for (var i = 0; i < drumButtons.length; i++) {
  drumButtons[i].addEventListener("click", function() {
    var buttonInnerHTML = this.innerHTML; // gets the letter (w, a, s, etc.)
    playSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
  });
}

// Add a keypress listener to the whole document
document.addEventListener("keypress", function(event) {
  playSound(event.key); // event.key is the character of the key pressed
  buttonAnimation(event.key);
});
