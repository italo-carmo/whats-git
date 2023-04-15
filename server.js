const express = require('express');
const venom = require('venom-bot');
const app = express();

const chromiumArgs = ['--disable-setuid-sandbox', '--disable-dev-shm-usage', '--no-sandbox'];
const puppeteerOptions = { executablePath: 'chromium-browser', args: chromiumArgs };



venom.create(options, null, puppeteerOptions)
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
  client.onStateChange((state) => {
    console.log('State changed: ', state);
    if ('CONFLICT'.includes(state)) client.useHere();
    if ('UNPAIRED'.includes(state)) console.log('logout');
  });
}