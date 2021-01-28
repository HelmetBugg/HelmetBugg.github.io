let thingsToLoad = [
  "res/alien.png",
];

  let g = hexi(512, 512, setup,  thingsToLoad, load);
  g.fps = 30;
  let version = 0.1;

  //Optionally scale and align the canvas inside the browser window
  g.scaleToWindow();
  g.start();
  let cats, title, ship;
  
  function load() {
    g.loadingBar();
  }

  function setup() {
    title = g.text("Schmuck " + version, "38px puzzler", "red");
    g.stage.putCenter(title);
    title.pivotX = 0.5;
    title.pivotY = 0.5;

    ship = g.circle(25, "blue", "black",  5, 750, 400);

    playButton = g.text("Play", "38px puzzler", "red");
    playButton.x = 400;
    playButton.y = 350;

    titleScene = g.group(title, playButton);
    gameScene = g.group(ship);

    g.makeInteractive(playButton);
    playButton.press = function(){
      g.slide(titleScene, -514, 0, 30, "decelerationCubed");
      g.slide(gameScene, -514, 0, 30, "decelerationCubed");
    }

    g.state = play;
  }
  
  function play() {
    //Rotate the text
    //message.rotation += 0.1;
  }
  

  