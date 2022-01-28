let fab;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fab = createFab();
  
    let connectButton = createButton('connect!');
    connectButton.position(20, 20);
    connectButton.mousePressed(function() {
      fab.serial.requestPort(); // choose the serial port to connect to
    });

    let printButton = createButton('print!');
    printButton.position(20, 60);
    printButton.mousePressed(function() {
      fab.print(); // start streaming the commands to printer
    });

    let stopButton = createButton('stop!');
    stopButton.position(20, 100);
    stopButton.mousePressed(function() {
      fab.stopPrint(); // stop streaming the commands to printer
    });

    let heatButton = createButton('heat!');
    heatButton.position(20, 140);
    heatButton.mousePressed(function() {
      fab.autoHeat(205, 55);
    });
}

function fabDraw() {
  // setup!
  fab.setAbsolutePosition(); // set all axes (x/y/z/extruder) to absolute
  fab.setERelative(); // put extruder in relative mode, independent of other axes
  fab.setTemps(205, 55); // (nozzleTemp, bedTemp) in °C - you should use a temperature best suited for your filament!
  fab.autoHome();
  fab.introLine(); // draw to lines on the left side of the print bed
  
  // variables for our hollow cube!
  let sideLength = 20; //mm
  let xStart = 100; // starting x position
  let yStart = 100; // starting y position
  let layerHeight = 0.2; // mm
  let amplitude = 3; // mm, amplitude in z
  let theta; // this will help us move in non-planar directions

  // speed and filament amount contribute to overall texture different. play with the values for different behaviour!
  let speed = 5; // mm/sec
  fab.extrusionMultiplier = 3; // deposit extra filament as we move so that it's heavier and falls/curls 

  // design our textured cube!
  fab.moveRetract(xStart, yStart, layerHeight); // move to the start (x,y,z) position without extruding

  // put down a flat first layer, for adhesion
  fab.moveExtrude(xStart + sideLength, yStart, layerHeight);
  fab.moveExtrude(xStart + sideLength, yStart + sideLength, layerHeight);
  fab.moveExtrude(xStart, yStart + sideLength, layerHeight);
  fab.moveExtrude(xStart, yStart, layerHeight);

  for (let z = layerHeight; z <= sideLength; z += layerHeight) { 
    amplitude = map(z, layerHeight, sideLength, 3, 25);
    // front side
    for (let x = xStart; x < xStart + sideLength; x += 1) {
      theta = map(x, xStart, xStart + sideLength, 0 , PI);
      fab.moveExtrude(x, yStart, z + amplitude*sin(theta), speed);
    }

    // right side
    for (let y = yStart; y < yStart + sideLength; y += 1) {
      theta = map(y, yStart, yStart + sideLength, 0 , PI);
      fab.moveExtrude(xStart + sideLength, y, z + amplitude * sin(theta), speed);
    }

    // // back side
    for (let x = xStart + sideLength; x > xStart; x -= 1) {
      theta = map(x, xStart, xStart + sideLength, 0 , PI);
      fab.moveExtrude(x, yStart + sideLength, z + amplitude * sin(theta), speed);
    }

    // // left side
    for (let y = yStart + sideLength; y > yStart; y -= 1) {
      theta = map(y, yStart, yStart + sideLength, 0 , PI);
      fab.moveExtrude(xStart, y, z + amplitude * sin(theta), speed);
    }
  }
  fab.presentPart();

}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  fab.render();
}