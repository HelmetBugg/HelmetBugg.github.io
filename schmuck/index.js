  let g = hexi(512, 512, setup, load);
  g.fps = 30;
  //Optionally scale and align the canvas inside the browser window
  g.scaleToWindow();
  g.start();
  let cats, message;
  
  function load() {
    //Display the file currently being loaded
    console.log(`loading: ${g.loadingFile}`);
    //Display the percentage of files currently loaded
    console.log(`progress: ${g.loadingProgress}`);
    //Add an optional loading bar.
    g.loadingBar();
  }

  function setup() {
    message = g.text("Tap for cats!", "38px puzzler", "red");
    g.stage.putCenter(message);
    message.pivotX = 0.5;
    message.pivotY = 0.5;
    g.state = play;
  }
  
  function play() {
    //Rotate the text
    message.rotation += 0.1;
  }
  

  