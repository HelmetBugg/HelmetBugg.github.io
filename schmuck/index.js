let thingsToLoad = [
  "res/alien.png",
];

  let g = hexi(512, 512, setup,  thingsToLoad, load);
  g.fps = 30;


  //Optionally scale and align the canvas inside the browser window
  g.scaleToWindow();
  g.start();
  let cats, message;
  
  function load() {
    g.loadingBar();
  }

  function setup() {
    message = g.text("Madduck Studios", "38px puzzler", "red");
    g.stage.putCenter(message);
    message.pivotX = 0.5;
    message.pivotY = 0.5;
    g.state = play;
  }
  
  function play() {
    //Rotate the text
    message.rotation += 0.1;
  }
  

  