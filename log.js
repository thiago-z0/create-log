
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

  var json = '';
  try {
    json = JSON.stringify(log);
  } catch (error) {
    json = log.toString();
    console.log('Log com erro na escrita!');
    return;
  }

  // Gera hash aleatorio para id de log.
  const n = Math.floor(Math.random() * 9999999999);
  const k = Math.floor(Math.random() * 9999999999);
  const secret = (n*k).toString();

  const time = new Date();
  const timeString = time.toString();

  var params = {
    DelaySeconds: 0,
    MessageBody: json,
    MessageAttributes: {
      "timeStampEnvio": {
        DataType: "String",
        StringValue: timeString,
      },
    },
    MessageDeduplicationId: secret, 
    MessageGroupId: secret+1,
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
