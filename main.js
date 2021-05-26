//Importa módulo do electron e pega campos de app e janela(BrowserWindow)
const { app, BrowserWindow } = require('electron');
//Importa configurações definidas no app.js
require('./app');

//Função para criar uma janela
function loadWindow(){
    const janela = new BrowserWindow({
        width: 800,
        height: 600,
    })
    //Define qual a primeira rota que será aberta ao iniciar electron
    janela.loadURL('http://localhost:3000/login');
}

//Cria a janela ao iniciar o electron
app.whenReady().then(loadWindow);
