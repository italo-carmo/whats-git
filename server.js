const express = require('express');
const venom = require('venom-bot');
const app = express();

const chromiumArgs = ['--disable-setuid-sandbox', '--disable-dev-shm-usage', '--no-sandbox'];
const puppeteerOptions = { executablePath: 'chromium-browser', args: chromiumArgs };



venom.create((
  'API-Whatsapp', 
    
    (base64Qrimg, asciiQR, attempts) => {
      console.log('Number of attempts to read the qrcode: ', attempts);
      console.log('Terminal qrcode: ', asciiQR);
      console.log('base64 image string qrcode: ', base64Qrimg);
    },
     (statusSession, session) => {
      console.log('Status Session: ', statusSession); 
      console.log('Session name: ', session);
    },
    {
      browserArgs: ['--no-sandbox'],
      disableWelcome: true,
    }))
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });


function start(client){
  const port = process.env.PORT
  app.listen(port, function(){
    console.log("Servidor Iniciado e escutando na porta 3000");
  });
  app.get("/api", async function(req,res,next){
    await client.sendText('55'+ req.query.celular + '@c.us', req.query.mensagem);
    res.json({msg: 'Mensagem enviada com sucesso para: '+req.query.celular});
  })
  app.get("/teste", async function(req,res,next){
    res.json({msg: 'Testando'});
  })
  client.onStateChange((state) => {
    console.log('State changed: ', state);
    if ('CONFLICT'.includes(state)) client.useHere();
    if ('UNPAIRED'.includes(state)) console.log('logout');
  });
}