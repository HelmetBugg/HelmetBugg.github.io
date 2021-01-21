let thingsToLoad = [
  "res/alien.png",
];

  let g = hexi(512, 512, setup,  thingsToLoad, load);
  g.fps = 30;
  let version = 0.1;

  //Optionally scale and align the canvas inside the browser window
  g.scaleToWindow();
  g.start();
  let cats, message;
  
  function load() {
    g.loadingBar();
  }

  function setup() {
    message = g.text("Schmuck " + version, "38px puzzler", "red");
    g.stage.putCenter(message);
    message.pivotX = 0.5;
    message.pivotY = 0.5;

    playButton = g.text("Play", "38px puzzler", "red");
    playButton.x = 400;
    playButton.y = 350;

    g.makeInteractive(playButton);
    playButton.press = () => console.log("butts");

    g.state = play;

  }
  
  function play() {
    //Rotate the text
    //message.rotation += 0.1;
  }
  

  