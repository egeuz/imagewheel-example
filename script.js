const uploadButton = document.getElementById("upload-button");
const uploadInput = document.getElementById("upload-input");
const circleImage = document.getElementById("circle-image-container");

let uploadedImage;
let testImage;
let resolution = 50;
let imageChunks = [];
let chunksOnScreen = [];
let imageIsReady = false;

/* P5 functions */
function preload() {
  // testImage = loadImage("./test-img.JPG")
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("canvas")

  uploadButton.addEventListener("click", function(event) {
    event.preventDefault() //safety
    uploadInput.click()
  })


  uploadInput.addEventListener("change", function() {
    //load in the user submitted image into the spinning circle + p5 canvas
    let imageData = URL.createObjectURL(uploadInput.files[0])
    circleImage.style.backgroundImage = `url(${imageData})`
    uploadedImage = loadImage(imageData)

    // //resizing the image + breaking it down into pieces
    // resizeImage(uploadedImage)
    // breakImageIntoChunks(uploadedImage)

    //switch to spinning image section & remove the upload button
    document.getElementById("upload-page").classList.remove("active")
    document.getElementById("spin-page").classList.add("active")
  })

  // resizeImage(testImage);
  // breakImageIntoChunks(testImage);
}

function draw() {

  //DO IT ONCE: ONCE UPLOADED IMAGE IS LOADED IN, RESIZE + CHUNK IT
  if (!imageIsReady && uploadedImage && uploadedImage.width !== 1) {
    resizeImage(uploadedImage)
    breakImageIntoChunks(uploadedImage)
    imageIsReady = true;
  }
  //keep background clear
  clear()
  // //periodically add a new chunk to the screen
  addNewChunkToScreen()
  //render & update the chunks on screen
  if (chunksOnScreen.length > 1) {
   chunksOnScreen.forEach(function(chunk) {
     chunk.checkBounds()
     chunk.update()
     chunk.render()
   }) 
  }
}

function resizeImage(image) {
  const heightRatio = image.height / image.width;
  const width = 400;
  image.resize(width, width * heightRatio)
}

/* custom functions */
function breakImageIntoChunks(image) {
  for (let x = 0; x < image.width; x += resolution) {
    for (let y = 0; y < image.width; y += resolution) {
      let imgData = image.get(x, y, resolution, resolution);
      let chunk = new ImageChunk(imgData)
      imageChunks.push(chunk)
    }
  }
}

function addNewChunkToScreen() {
  if (imageChunks.length > 0) {
    //pick a random index from the imageChunks array
    let randomIndex = floor(random(0, imageChunks.length))
    //get the image chunk at the random index
    let randomChunk = imageChunks[randomIndex]
    //remove the image chunk from the imageChunks array
    imageChunks.splice(randomIndex, 1)
    //add the chunk to chunksOnScreen
    chunksOnScreen.push(randomChunk)
  }
}

class ImageChunk {

  constructor(chunk) {
    this.chunk = chunk;
    this.position = createVector(width / 2, height / 2)
    this.velocity = createVector(random(-30, 30), -10);
  }

  update() {
    this.position.add(this.velocity)
  }

  checkBounds() {

    let r = this.resolution;

    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x *= -1;
      this.velocity.mult(0.5);
    }

    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y *= -1;
      this.velocity.mult(0.5);
    }

    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
      this.velocity.mult(0.5);
    }

    if (this.position.y > height) {
      this.position.y = height;
      this.velocity.y *= -1;
      this.velocity.mult(0.5);
    }
  }

  render() {
    image(this.chunk, this.position.x, this.position.y, this.chunk.width, this.chunk.height)
  }

}