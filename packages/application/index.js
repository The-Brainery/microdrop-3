const url = require('url');
const path = require('path');
const {spawn} = require('child_process');

const {app, dialog, ipcMain, BrowserWindow} = require('electron');
// require('electron-debug')({enabled: true});

const _ = require('lodash');

const MicrodropModels = require('@microdrop/models');

function init () {
  let win;
  const options = {
    webPreferences: {
      webSecurity: false
    },
    show: false
  };

  // Load webserver:
  win = new BrowserWindow(options);
  win.loadURL(url.format({
    pathname: path.resolve(__dirname, 'public/web-server.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Load models
  MicrodropModels.initAsElectronProcesses();

  // Load main window
  ipcMain.on('broker-ready', function(event, arg) {
    win = new BrowserWindow(_.extend(options, {show: true}));
    win.loadURL(url.format({
      pathname: path.resolve(__dirname, 'public/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  });

  win.on('closed', () => app.quit() );

}

// Listen for app to be ready
app.on('ready', () => init() );
