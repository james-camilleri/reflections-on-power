var capture,
    pixelSize = 20,
    lightValue = 0,
    videoWidth = 1280,
    videoHeight = 720,
    sparkUrls = [
					"https://api.particle.io/v1/devices/1e003b000347343232363230/ledvalue?access_token=593336c998dcdcc06ddf39a64b3b984c3747344e",
					"https://api.particle.io/v1/devices/3f0031000547343337373737/ledvalue?access_token=593336c998dcdcc06ddf39a64b3b984c3747344e",
					"https://api.particle.io/v1/devices/3f0027001447343432313031/ledvalue?access_token=593336c998dcdcc06ddf39a64b3b984c3747344e"
				];

// Retreives light data from sensors and uses it to calculate the image distortion value.
function updateResolution() {

	lightValue = 0;
	console.log("Updating Resolution");
	async.each(sparkUrls, readSensor, calculateResolution);

}

// Makes an Ajax request to a Spark and returns the stored light sensor value.
function readSensor(sparkUrl, callback) {
	$.ajax({ url: sparkUrl, error: function(){ callback(); }, timeout: 2000 })
		.done(function( data ) {
			lightValue += data.result;
			callback();
	});
}

function calculateResolution(data) {

	console.log(lightValue);

	switch (lightValue) {

		case 0: pixelSize = 0; break;
		case 1: pixelSize = 20; break;
		case 2: pixelSize = 40; break;
		case 3: pixelSize = 80; break;
		default: pixelSize = 80; break;

	}

	// Update the resolution again in a second.
	setTimeout(updateResolution, 1000);

}

// Setup the p5 sketch.
function setup() 
{

	// Set up canvas and drawing settings.
	c = createCanvas(videoWidth, videoHeight);
	noStroke();

	// Stretch canvas.
	$("canvas").width(1900).height(1050);

	// Open video stream and hide video.
	capture = createCapture(VIDEO);
	capture.size((videoWidth), (videoHeight));
	capture.hide();

	// Update the video resolution, and therefore start the periodic cycle.
	setTimeout(updateResolution, 1000);

}

// Loop and draw.
function draw() 
{

  // Load pixels in video frame.
  capture.loadPixels();

  if (pixelSize == 0) {

  	// Reflect original feed for highest quality image.
  	push(); 
	translate(capture.width,0); 
	scale(-1.0,1.0); 
	image(capture,0,0); 
	pop();
  	scale(1,1);

  } else {

  	// Loop through pixels and redraw on a larger scale.
	for (var x = 0; x < videoWidth; x += pixelSize) {
		for (var y = 0; y < videoHeight; y += pixelSize) {

		  // Pick a pixel on the scaled down capture feed.
		  var loc = ((y * videoWidth) + x) * 4;

		  // Set the fill colour to the colour of the next pixel.
		  fill(capture.pixels[loc], capture.pixels[loc + 1], capture.pixels[loc + 2]);

		  // Draw a box in the correct colour, but invert the x-axis.
		  rect((videoWidth - x), y, -pixelSize, pixelSize);

		}
	}

  }

}



function mouseClicked() {
  saveCanvas(c,"images\\"+Date.now(),"jpg");
  return false;
}