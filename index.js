let http = require('http');
let express = require('express');
let app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);
//let io = new Server(server);

const {SerialPort} = require('serialport')
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
})

var firstName = 'walbert';

app.set('view engine', 'ejs');

//Rota para a pagina index
app.get('/index', function(req, res){
  res.render("index");
});

//Rota para a pagina about
app.get('/about', function(req, res){
  res.render('about',{
    firstNameA: firstName
  });
});

//Rota para a pagina getData
app.get('/getData', function(req, res){
  res.render("getData");
});

//Abre a porta serial
port.on('open', function(){
  console.log('Porta Serial aberta', port.read);
})


// port.on('data', (data) => {
//   console.log('Received data:', data.toString());
// });

//Cria um socket para enviar mensagem
io.on('connection', function(socket){
  console.log('Conexao estabelecida');
  //Envia a mensagem (ID=exemplo, Mensagem=Testando emit)
  //socket.emit('dadosPortaArduino', "Testando Agora");
  port.on('data', function(data){
    //data = data.trim();
    socket.emit('data', data.toString());
  });
  // socket.emit('dadosPortaArduino', (data)=> {
  //   ('dadosPortaArduino', data.toString());
  //   });
  
  //Recebe os dados da pagina WEB, pacote pagWEBButton
  //socket.on('pagWEBButton',function(msg){
  //  console.log('pagWEBButton', 'Resposta WEB')
  //});
  
  //Recebe os dados da pagina WEB, pacote pagWEBButton
   socket.on('True_RED',function(msg){
    port.write('true_red')
  });

  socket.on('False_RED',function(msg){
    port.write('false_red')
  });

  //Função retorna quando o browser for deconctado do servidor
  socket.on('disconect', function(){
  console.log('Servidor disconectado');
});

});

port.on('error', (err) => {
  console.error('Error:', err.message);
});

server.listen(8080, function(){
  console.log('Escutando na porta ')
});