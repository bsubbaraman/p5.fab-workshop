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
      fab.stopPrint(); // stop streaming the commands to printer.
    });

    let heatButton = createButton('heat!');
    heatButton.position(20, 140);
    heatButton.mousePressed(function() {
      fab.autoHeat(205, 55);
    });
}


function fabDraw() {
  // setup! we'll want to always start fabDraw with these 3 commands:
  fab.setAbsolutePosition(); // set the coordinate system mode
  fab.setERelative(); // it's easier to work with the extruder axis in relative positioning
  fab.autoHome(); // establish a (0,0,0)

  

  
  fab.presentPart(); // push the bed out to grab your print!
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  fab.render();
}

