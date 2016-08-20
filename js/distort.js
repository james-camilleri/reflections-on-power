var capture,
    pixelSize = 20,
    videoWidth = 1280,
    videoHeight = 720;

function setup() 
{

  // Set up canvas and drawing settings.
  createCanvas(videoWidth, videoHeight);
  noStroke();

  // open video stream and hide video.
  capture = createCapture(VIDEO);
  capture.size((videoWidth/pixelSize), (videoHeight/pixelSize));
  capture.hide();

}

function draw() 
{

  // Load pixels in video frame.
  capture.loadPixels();

  // Loop through pixels and redraw on a larger scale.
  for (var x = 0; x < videoWidth; x += pixelSize) {
    for (var y = 0; y < videoHeight; y += pixelSize) {

      // Pick a pixel on the scaled down capture feed.
      var loc = ((y/pixelSize) * (videoWidth/pixelSize) + (x/pixelSize)) * 4;

      // Set the fill colour to the colour of the next pixel.
      fill(capture.pixels[loc], capture.pixels[loc + 1], capture.pixels[loc + 2]);

      // Draw a box in the correct colour, but invert the x-axis.
      rect((videoWidth - x), y, -pixelSize, pixelSize);

    }
  }

} 
