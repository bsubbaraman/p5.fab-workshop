let fab;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fab = createFab();

  // add a buttons to connect to the printer & to print!
  let connectButton = createButton('connect!');
  connectButton.position(20, 20);
  connectButton.mousePressed(function() {
    fab.serial.requestPort();
  });

  let printButton = createButton('print!');
  printButton.position(20, 60);
  printButton.mousePressed(function() {
    fab.print();
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
  // setup printing variables
  // this is a standard setup block:
  fab.setAbsolutePosition(); // set the coordinate system mode
  fab.setERelative();
  fab.setTemps(205, 55); // wait for nozzle & bed to heat up
  fab.autoHome();
  fab.introLine(); // line back and forth to clean nozzle
    
  /* design your artifact here!
   *  here's a vase line vase, based on LIA's 'Filament Sculptures' 
   * https://www.liaworks.com/theprojects/filament-sculptures/
   */

  let startHeight = 0.2;
  let dotHeight = 2;
  let speed = 40;
  let x = 100;
  let y = 100;
  let l = 40;
  fab.moveRetract(x, y, startHeight); // move to start
  
  for (let h = startHeight; h <= l; h += dotHeight) { 
    // lines
    fab.moveExtrude(x + l, y, h, speed);
    fab.moveExtrude(x + l, y + l, h, speed);
    fab.moveExtrude(x, y + l, h, speed);
    fab.moveExtrude(x, y, h, speed);

    // dots
    fab.moveExtrude(x, y, h + dotHeight, 0.4, 5); // move slowly and extrude lots of filament on the dots
    fab.moveRetract(x + l, y, h, 3 * speed); // move quickly from point to point to reduce stringing
    fab.moveExtrude(x + l, y, h + dotHeight, 0.4, 5);
    fab.moveRetract(x + l, y + l, h, 3 * speed);
    fab.moveExtrude(x + l, y + l, h + dotHeight, 0.4, 5);
    fab.moveRetract(x, y + l, h, 3 * speed);
    fab.moveExtrude(x, y + l, h + dotHeight, 0.4, 5);

    fab.moveRetract(x, y, h + dotHeight, speed);
  }
  // end artifact

  fab.presentPart(); // pop the bed out. 
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  fab.render();
}