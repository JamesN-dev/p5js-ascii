let asciiart;
let gfx;
let ascii_arr;
let currentAnimation;
let zoomLevel = 1; // Start with no zoom
let baseFrequencySine = 0.005; // Base frequency for sine wave
let baseFrequencyTriangle = 0.005; // Base frequency for triangle wave
let amplitude = 80; // Initial amplitude
let distortionFactor = 1; // No distortion initially
let keyIsHeld = false;
let lastActionTime = 0; // Time since the last action for continuous press
let initialDelay = 2000; // Initial delay before starting continuous action, in milliseconds
let repeatInterval = 200; // Interval between continuous actions, in milliseconds
let currentKeyCode; // Store the current key code being pressed
let shouldSortPixels = false;
let customFont;

// function preload() {
//   customFont1 = loadFont('fonts/C64_Pro_Mono-STYLE.ttf');
// }

//const charset = "╭╭░░░░░╮╮▇▚▚▚▞▞▇█▌▐▄▀░▒▓▓ "; // From darker to lighter

function setup() {
   createCanvas(600, 600);
   gfx = createGraphics(600, 600);
   gfx.pixelDensity(3);
   asciiart = new AsciiArt(this, 'monospace', 8, NORMAL); // Directly setting font properties
   textFont('Courier New');
   textSize(12); // Adjusted text size for better visibility
   textLeading(12); // Adjusted text leading to match the textSize
   currentAnimation = drawSineWave; // Retain user input features
}


function draw() {
   if (shouldSortPixels) {
       sortPixels();
       shouldSortPixels = false; // Reset flag after sorting
   }
   gfx.background(0);
   currentAnimation(); // Execute the current animation based on user input

   // Convert gfx content to ASCII art
   let ascii_arr = asciiart.convert(gfx, gfx.width / 5, gfx.height / 5); // Adjust for desired ASCII resolution
   let asciiImage = asciiart.convert2dArrayToString(ascii_arr); // Convert the 2D array to a string

   background(0); // Clear the main canvas
   fill(255); // Set text color to white
   textSize(8); // Match ASCII art resolution
   textLeading(7); // Adjust line spacing to match textSize
   text(asciiImage, 10, 10); // Display the ASCII image on the canvas

   // Check if a key is held down for continuous action
   if (keyIsHeld && millis() - lastActionTime > initialDelay) {
       if (millis() - lastActionTime >= repeatInterval) {
           processKey(false); // Process the held key
           lastActionTime = millis(); // Update the last action time
       }
   }
}

function convertToAsciiCustom(gfx) {
   gfx.loadPixels();
   let asciiImage = "";
   for (let y = 0; y < gfx.height; y++) {
       for (let x = 0; x < gfx.width; x++) {
           let index = (y * gfx.width + x) * 4;
           let avg = (gfx.pixels[index] + gfx.pixels[index+1] + gfx.pixels[index+2]) / 3;
           asciiImage += mapBrightnessToChar(avg);
       }
       asciiImage += '\n';
   }
   return asciiImage;
}

// Maps brightness to character from the charset
function mapBrightnessToChar(brightness) {
   let index = Math.floor(map(brightness, 0, 255, charset.length-1, 0));
   let selectedChar = charset[index];
   console.log(`Brightness: ${brightness}, Index: ${index}, Selected Char: '${charset[index]}'`);

   return selectedChar;
}


function drawSineWave() {
   gfx.stroke(255);
   gfx.noFill();
   let frequency = (baseFrequencySine / zoomLevel) * distortionFactor;
   gfx.beginShape();
   for (let x = 0; x < gfx.width; x++) {
       let angle = TWO_PI * frequency * x + frameCount * 0.02; // Adding time variation
       let y = gfx.height / 2 + amplitude * sin(angle);
       gfx.vertex(x, y);
   }
   gfx.endShape();
}

function drawTriangleWave() {
   gfx.stroke(255);
   gfx.noFill();
   let frequency = (baseFrequencyTriangle / zoomLevel) * distortionFactor;
   gfx.beginShape();
   for (let x = 0; x < gfx.width; x++) {
       let angle = TWO_PI * frequency * x + frameCount * 0.02; // Adding time variation
       // Triangle waveform calculation (kept as is or adjust similarly to sine wave for animation)
       let y = gfx.height / 2 + amplitude * (2 * abs(2 * (angle / TWO_PI - floor(angle / TWO_PI + 0.5))) - 1);
       gfx.vertex(x, y);
   }
   gfx.endShape();
}

function drawDynamicWave() {
   console.log("Drawing dynamic wave.");
   gfx.background(0);
   gfx.stroke(255);
   gfx.noFill();

   let waveHeight = 80; // Amplitude of the wave
   let waveCount = 6; // How many waves
   let waveSpacing = gfx.width / waveCount; // Spacing between waves

   for (let i = 0; i < waveCount; i++) {
       gfx.beginShape();
       for (let x = 0; x < gfx.width; x++) {
           let angleOffset = (TWO_PI / gfx.width) * waveSpacing * i;
           let y = gfx.height / 3 + sin((x * .01 * baseFrequencySine) + frameCount * 0.02 + angleOffset) * waveHeight * distortionFactor;
           gfx.vertex(x, y);
       }
       gfx.endShape();
   }
}

 function keyPressed() {
   keyIsHeld = true;
   currentKeyCode = keyCode; // Store the keyCode of the currently pressed key
   lastActionTime = millis(); // Reset the timer on a new key press
   processKey(true); // Initial key press action

   // Trigger pixel sorting when 'P' is pressed
   if (key === 'P' || key === 'p') {
       sortPixels();
   }
}
 
 function keyReleased() {
   keyIsHeld = false;
 }

 function resetControls() {
   zoomLevel = 1; // Reset zoom level
   amplitude = 80; // Reset amplitude
   distortionFactor = 1; // Reset distortion factor
   // Add any other controls you'd like to reset
}

 function processKey(isInitialPress) {
   let adjustmentFactor = keyIsDown(SHIFT) ? 10 : 1; // Adjust the factor based on Shift key

   // Key actions based on keyCode
   switch (currentKeyCode) {
      case 48: // '0' key for reset
         if (isInitialPress) {
            resetControls();
         }
         break;
      case 49: // '1' key for Sine Wave
         if (isInitialPress) currentAnimation = drawSineWave;
         break;
      case 50: // '2' key for Triangle Wave
         if (isInitialPress) currentAnimation = drawTriangleWave;
         break;
      case 51: // Assuming '3' key switches to the sphere animation
         if (isInitialPress) currentAnimation = drawDynamicWave;
         break;    
      case 187: // '+' key to increase zoom level (main keyboard, requires shift)
      case 107: // Numpad '+' key to increase zoom level
         zoomLevel = max(1, zoomLevel * (2 * adjustmentFactor));
         break;
      case 189: // '-' key to decrease zoom level (main keyboard)
      case 109: // Numpad '-' key to decrease zoom level
         zoomLevel = max(1, zoomLevel / (2 * adjustmentFactor));
         break;
      case UP_ARROW: // Up arrow to increase amplitude
         amplitude += 10 * adjustmentFactor;
         break;
      case DOWN_ARROW: // Down arrow to decrease amplitude
         amplitude = max(10, amplitude - 10 * adjustmentFactor);
         break;
      case RIGHT_ARROW: // Right arrow to increase distortion factor
         distortionFactor += 0.1 * adjustmentFactor;
         break;
      case LEFT_ARROW: // Left arrow to decrease distortion factor
         distortionFactor = max(1, distortionFactor - 0.1 * adjustmentFactor);
         break;
   }
}

function sortPixels() {
   console.log("Sorting pixels now.");
   gfx.loadPixels();
   // Sort pixels based on brightness
   for (let y = 0; y < gfx.height; y++) {
     for (let x = 0; x < gfx.width - 1; x++) {
       let index = (x + y * gfx.width) * 4;
       let nextIndex = (x + 1 + y * gfx.width) * 4;
       let brightnessCurrent = (gfx.pixels[index] + gfx.pixels[index + 1] + gfx.pixels[index + 2]) / 3;
       let brightnessNext = (gfx.pixels[nextIndex] + gfx.pixels[nextIndex + 1] + gfx.pixels[nextIndex + 2]) / 3;
       if (brightnessCurrent > brightnessNext) {
         // Swap pixels
         for (let i = 0; i < 4; i++) {
           let temp = gfx.pixels[index + i];
           gfx.pixels[index + i] = gfx.pixels[nextIndex + i];
           gfx.pixels[nextIndex + i] = temp;
         }
       }
     }
   }
   gfx.updatePixels();
 }


