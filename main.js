const { app, BrowserWindow } = require('electron');
require('./app');

function loadWindow(){
    const janela = new BrowserWindow({
        width: 800,
        height: 600,
    })
    janela.loadURL('http://localhost:3000/');
}

app.whenReady().then(loadWindow);
