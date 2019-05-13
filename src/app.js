class Config {
  intervalSpeed;
  numberOfBubbles;
  bubbleSpeedMin;
  bubbleSpeedMax;

  constructor(intervalSpeed, numberOfBubbles, bubbleSpeedMin, bubbleSpeedMax) {
    this.intervalSpeed = intervalSpeed;
    this.numberOfBubbles = numberOfBubbles;
    this.bubbleSpeedMin = bubbleSpeedMin;
    this.bubbleSpeedMax = bubbleSpeedMax;
  }

  changeIntervalSpeed(intervalSpeed) {
    this.intervalSpeed = intervalSpeed;
  }

  changeNumberOfBubbles(numberOfBubbles) {
    this.numberOfBubbles = numberOfBubbles;
  }

  changeBubbleSpeed(bubbleSpeedMin, bubbleSpeedMax) {
    this.bubbleSpeedMin = bubbleSpeedMin;
    this.bubbleSpeedMax = bubbleSpeedMax;
  }
}

class Bubble {
  radius;
  speed;
  positionX;
  positionY;
  directionX;
  directionY;
  bubbleId;
  color;

  constructor(id, speedMin, speedMax) {
    this.id = id;

    // Randomize radius
    this.radius = Math.random() * 5 + 20;

    // Randomize position
    this.positionX = Math.random() * (canvasWidth - this.radius * 2) + this.radius;
    this.positionY = Math.random() * (canvasHeight - this.radius);

    // Randomize speed
    this.speed = Math.random() * speedMax + speedMin

    // Randomize direction
    this.directionX = (Math.random() - 0.5) * this.speed;
    this.directionY = (Math.random() - 0.5) * this.speed;

    this.color = "rgba(100, 100, 230, 100)";
  }

  // Draw bubble
  draw() {
    c.beginPath();
    c.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);

    // Color bubbles with radial gradient colors
    let gradient = c.createRadialGradient(this.positionX, this.positionY, this.radius,
      this.positionX + 30, this.positionY+20, this.radius*2);
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(1, this.color);
    
    c.fillStyle = gradient;
    c.fill();
    c.stroke();
    c.closePath();
  }
}

// Get canvas element from HTML and store its width and height
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var canvasWidth = document.getElementById("canvas").clientWidth;
var canvasHeight = document.getElementById("canvas").clientHeight;

// Set canvas proportions to match HTML element size
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// For mouse events. Offset is for converting global mouse position 
// to canvases local position
let mouseX = 0;
let mouseY = 0;
let offsetY = canvas.getBoundingClientRect().top;
let offsetX = canvas.getBoundingClientRect().left;

let config = new Config(20, 10, 2, 4);
let bubbles = [];

// Create bubble objects and push them to array
for (let index = 0; index < config.numberOfBubbles; index++) {
  bubbles.push(new Bubble(index + 1, config.bubbleSpeedMin, config.bubbleSpeedMax));
};

// Update bubbles
setInterval(() => {
  animate();
}, config.intervalSpeed);

addEventListener("mousedown", () => {
  mouseX = Math.round(event.clientX - offsetX);
  mouseY = Math.round(event.clientY - offsetY);
  
  // Check if any bubbles have been clicked
  bubbles.forEach(bubble => {
    // Calculate mouse distance from bubble
    let distanceX = mouseX - bubble.positionX;
    let distanceY = mouseY - bubble.positionY;
    if (Math.pow(distanceX, 2) + Math.pow(distanceY, 2) < Math.pow(bubble.radius, 2)) {
      // Print bubble id and position
      console.log(`Clicked bubble #${bubble.id}: X: ${mouseX}, Y: ${mouseY}`);
    }
  });
  
});

// Interval handler function
function animate() {
  // Clear frame for next frame
  c.clearRect(0, 0, canvasWidth, canvasHeight)
  // Draw each bubble and move them
  bubbles.forEach(bubble => {
    bubble.draw();
    bubble.positionX += bubble.directionX;
    bubble.positionY += bubble.directionY;

    // Check if bubble is colliding with canvas border and change direction
    if (bubble.positionY + bubble.radius > canvasHeight
              || bubble.positionY - bubble.radius < 0) {
      bubble.directionY = -bubble.directionY;
    }
    if (bubble.positionX + bubble.radius > canvasWidth 
              || bubble.positionX - bubble.radius < 0) {
      bubble.directionX = -bubble.directionX;
    }
  });
};

let infoText = document.getElementById("info");
infoText.textContent = `Number of bubbles: ${config.numberOfBubbles}, interval: ${config.intervalSpeed}, speed: ${config.bubbleSpeedMin}-${config.bubbleSpeedMax}`;