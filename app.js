//Importando módulos necessários
    //Módulo do express para trabalhar com rotas
    const express = require("express");
    //Módulo do axios e do cors para realizar requisições http para a API
    const axios = require("axios");
    const cors = require("cors");
    //Módulo da view engine handlebars para trabalhar com renderização de páginas html e facilitar a manipulação de dados vindo do backend/requisições http
    const handlebars = require('express-handlebars');

    /*
    const { readSync } = require("original-fs");// Tá usando esse módulo?
    */

//Configurações
    //Instancia o express para trabalhar com seus métodos
    const app = express();
    //Define a view engine para a handlebars
    app.set('view engine', 'handlebars');
    //Define que o layout padrão será definido pelo arquivo 'main.handlebars', não é preciso incluir a extensão
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    //Define que é possível trabalhar com requisições do tipo json e http
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors());
    //Define que é possível trabalhar com os arquivos estáticos da pasta 'public'
    app.use(express.static('public'));

//Define url padrão para acessar a API
const url = "https://shielded-island-23034.herokuapp.com/";

//Definindo funções para usar nas rotas
    //Função para tentar realizar o login. 
    function login(email, senha){
        //Retorna o resultado da promise para tentar fazer login
        return new Promise((resolve, reject) => {
            //Requisição para url definida com os dados passados para a função
            axios.post(url + 'operadores/login', {
            email: email,
            senha: senha
            }).then((res) => {
                //Recebe resposta após acessar a rota e retorna o seu status
                resolve(res.status);
            }).catch((err) => {
                //Caso retorne um erro, rejeita o login e envia o erro
                reject(err);
            });
        });
    }

    //Função para obter as reclamações
    function get_reclamacoes(){
        return new Promise((resolve, reject) => {
            axios.get(url + 'reclamacoes').then((res) => {
                //Recebe resposta após acessar a rota e retorna apenas os dados(reclamações)
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    //Função para obter técnicos registrados
    function get_tecnicos(){
        return new Promise((resolve, reject) => {
            axios.get(url + 'tecnicos/get_all').then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    //Função para cadastrar um operador
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

//Definindo rotas
    //Rota inicial de login
    app.get("/login", (req, res) => {
        res.render('login');
    });
    
    //Rota para verificar se os dados estão cadastrados para login
    app.post("/login", (req, res) => {
        //Variáveis para armazenar dados enviados para esta rota
        let email = String(req.body.email);
        let senha = String(req.body.senha);
        //Chama função de login com os dados
        login(email, senha).then(result => {
            if(result == 200){
                get_reclamacoes().then(results => {
                    return res.render('home', {results: results});
                }).catch(error => {
                    return res.render('home', {results: null, error: error});
                }); 
            }// 500 pro erro do servidor e 404 para recurso não encontrado.
            else{
                return res.render('errors/login', {error: result});
            }
        })
        .catch(error => {
            return res.render('errors/login', {error: error});
        });
    });

    //Rota do formulário de cadastro de um operador
    app.get("/cadastro", (req, res) => {
        res.render("cadastro");
    });

    //Rota para cadastro de um operador
    app.post("/cadastro", (req, res) => {
        create_operator(req.body.nome ,req.body.email ,req.body.telefone ,req.body.senha ,req.body.cargo).then(result => {
            if(result == 201){
                return res.render('login');
            }else if(result == 409){
                return res.render('errors/cadastro', {error: 'Usuário já existe'});
            }else{
                return res.render('errors/cadastro', {error: 'Erro indefinido'});
            }
        }).catch(error => {
            return res.render('errors/cadastro', {error: error});
        })
    });

    //Rota para a página principal do operador após login
    app.get('/', (req, res) => {
        get_reclamacoes().then(results => {
            return res.render('home', {results: results});
        }).catch(error => {
            return res.render('home', {results: null, error: error});
        });
    })

    //Rota para deletar uma reclamação
    app.post('/reclamacao/deletar', (req, res) => {
        axios.delete(url + 'reclamacoes/' + req.body.id, {data: {reclamacaoId: req.body.id}}).then(response =>{
            if(response.status == 200){
                res.render('home');
            }else{
                res.send('não foi possivel deletar');
            }
        }).catch(error => {
            return res.render('errors/cadastro', {error: error});
        });
    });

    //Rota para obter tecnicos registrados
    app.get('/tecnicos', (req, res) => {
        get_tecnicos().then(results => {
            return res.render('tecnicos', {results: results});
        }).catch(error => {
            return res.render('tecnicos', {results: null, error: error});
        });
    })

//Define constante para a porta que será usada
const PORT = 3000;
//Define que porta será "escutada"/"vigiada"
app.listen(PORT, () => {
    console.log("Connection started at port: "+PORT);
});

//Exporta módulo app com as configurações
module.exports = app;