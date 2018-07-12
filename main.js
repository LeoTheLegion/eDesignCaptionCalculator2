const {app, BrowserWindow, ipcMain} = require('electron')
//const temp = require('temp').track();
const path = require ('path');
const fs = require('fs');
//const path = require('path');
const unzip = require('unzipper')

  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
		width: 550, 
		height: 350})
  
    // and load the index.html of the app.
    win.loadFile('index.html')
  	win.setResizable(false)
	win.setMenu(null)
    // Open the DevTools.
  // win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  
  // receive message from index.html 
	ipcMain.on('file.zip', function (event, file) {
	console.log( "Main:" + file );
		
	var foundcount = 0;
	var name = (file.replace(/^.*[\\\/]/, '').slice(0,-4)).replace(/\s/g, "");;
	fs.createReadStream(file)
	  .pipe(unzip.Parse())
	  .on('entry', function (entry) {
		  var fileName = entry.path;
		console.log(name)
		  console.log(fileName)
		   
		
		var type = entry.type; // 'Directory' or 'File'
		var size = entry.size;
		if (fileName.indexOf(name)>-1) {
		  entry.pipe(fs.createWriteStream(__dirname+"test.html"));
			// event.sender.send('log', __dirname);
			foundcount += 1 ;
		} else {
		  entry.autodrain();
		}
	  }).on('finish',function (entry){
		  event.sender.send('file.html', __dirname+ "test.html");
	  });
		if(foundcount >= 1 ){
				console.log( "This is not a MediaSite Zip File" );
			}else{
				  //event.sender.send('file.html', "test.html");
			}
	 
	// toPdf = require("jspdf");
		//var doc = new toPdf();

		//doc.text('Hello world!', 10, 10);
	  
	  
  });