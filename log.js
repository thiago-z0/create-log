
// Inclua com NPM ou YARN: 'aws-sdk'
import AWS from 'aws-sdk';
AWS.config.update({region: 'sa-east-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});


/*  Funcao chamada para Enviar Log para o SQS. (Recebe um Json como argumento).
      Estrutura Json Nescessaria: 
      {
      "app" : "peerbr" ou "adiante" ou "fmi",
      "nivel" : "info" ou "alerta" ou "erro",
      "mensagem" : "Descricao do erro, Local do erro(funcao, if), etc",
      "detalhes" : "Referente a (exemplo: numero da nota, nome do usuario, etc)",
      "ip" : "ip do usuario"(se nao aplicavel, cooque o valor '0'),
      "erro": "'error' do console (Catch, etc.)"
      }*/
export default async function Log (log) {

  // Time-stamp da criacao do log.
  const timeStampEnvio = new Date();

  var json = '';
  try {
    const novoArray = log.push(timeStampEnvio);
    json = JSON.stringify(novoArray);
  } catch (error) {
    json = log.toString();
    console.log('Log com erro na escrita!');
  }

  // Gera hash aleatorio para id de log.
  const n = Math.floor(Math.random() * 11);
  const k = Math.floor(Math.random() * 1000000);
  const secret = String.fromCharCode(n) + k;

  var params = {
    DelaySeconds: 0,
    MessageBody: json,
    MessageDeduplicationId: secret, 
    MessageGroupId: secret,
    // Url da QUEUE
    QueueUrl: "https://sqs.sa-east-1.amazonaws.com/544005205437/logs.fifo"
  };

  // Envia o Log.
  await sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Erro ao Enviar o Log", err);
    } else {
      console.log("Log Enviado ("+secret+")");
    }
  });
};
