const express = require("express");

const cors = require("cors");

const axios = require("axios");
const { readSync } = require("original-fs");

const app = express();

//Teste
const handlebars = require('express-handlebars');
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
//Teste

const url = "https://shielded-island-23034.herokuapp.com/";

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.listen(3000, () => {
    console.log("connection started at 3000.");
});
// tenta realizar o login. 
function login(email, senha){

    return new Promise( (resolve, reject) => {

        axios.post(url + 'operadores/login', {
           email: email,
           senha: senha
        })
          .then( (res) => {
            resolve(res.status);
          })
          .catch( (err) => {
            reject(err);
        });
    });
}
function get_reclamacoes(){

    return new Promise( (resolve, reject) => {

        axios.get(url + 'reclamacoes', {
        
        }).then( (res) => {
            resolve(res.data);
        }).catch( (err) => {
            reject(err);
        });
    });
}
// Raiz do programa. Envia a tela de login como primeira tela que o usuário visualiza. *** voltar para /login/login.html


app.post('/reclamacao/deletar', (req, res) => {
    axios.delete(url + 'reclamacoes/' + req.body.id, {data: {reclamacaoId: req.body.id}}).then(response =>{
        if(response.status == 200){
            res.render('home');
        }else{
            res.send('não foi possivel deletar');
        }
    }).catch();

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login/login.html");
});

app.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

app.post("/cadastro", (req, res) => {
    create_operator(req.body.nome ,req.body.email ,req.body.telefone ,req.body.senha ,req.body.cargo).then(result => {
        if(result == 201){
            alert('usuário criado com sucesso');
            return res.sendFile(__dirname + '/login/login.html');
            
        }else if(result == 409){
            return res.send('usuário já existe');
        }else{
            return res.send('Erro indefinido');
            
        }
    }).catch(error => {
        return res.send('error');
    })
});

function create_operator(nome, email, telefone, senha, cargo){
    return new Promise((resolve, reject) => {
        axios.post(url + 'operadores/signup', {
            nome: nome,
            telefone: Number(telefone),
            email: email,
            senha: senha,
            cargo: cargo
          }).then(function (response) {
                resolve(response.status);
          })
          .catch(function (error) {
                reject(error);
          });
    });
}

// Obtém as informações do formulário.
app.post("/", (req, res) => {

    let email = String(req.body.email);
    let senha = String(req.body.senha);
    // passa os dados obtidos para a função criada, exibe a tela de acordo com a promessa.
    login(email, senha)
    .then(result => {
        if(result == 200){
            get_reclamacoes().then(results => {
                return res.render('home', {results: results})
            }).catch(err => {
                return res.render('home', {results: 0})
            }); 
        }// 500 pro erro do servidor e 404 para recurso não encontrado.
        else{
            return res.sendFile(__dirname + "/failure.html");
        }
    })
    .catch(err => {
        return res.send(err);
    });
});


module.exports = app;