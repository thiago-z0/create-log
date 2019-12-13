<?php

// Caminho do Arquivo 'aws.phar' (baixe manualmente de https://docs.aws.amazon.com/aws-sdk-php/v3/download/aws.phar)
require 'aws.phar';

use Aws\Sqs\SqsClient; 
use Aws\Exception\AwsException;

/*  Funcao chamada para Enviar Log para o SQS. (Recebe um Json como argumento).
      Estrutura Json Nescessaria: 
      {
      "app" : "peerbr" ou "adiante" ou "fmi",
      "nivel" : "info" ou "alerta" ou "erro",
      "mensagem" : "Descricao do erro, Local do erro(funcao, if), etc",
      "detalhes" : "Referente a (exemplo: numero da nota, nome do usuario, etc)",
      "ip" : "ip do usuario"(se nao aplicavel, cooque o valor '0'),
      "erro": "'error' do console (Catch, etc.)"
      }
   */
function enviarLog ($json){
  $msg = $json;
  $num = (string) md5(uniqid(rand(), true));

  $client = new SqsClient([
    'profile' => 'default',
    'region' => 'sa-east-1',
    'version' => '2012-11-05'
  ]);
  
  $params = [
    'DelaySeconds' => 0,
    'MessageGroupId' => $num,
    'MessageDeduplicationId' => $num,
    'MessageBody' => $msg,
    //URL da Queue.
    'QueueUrl' => ''
  ];
  
  try {
    $result = $client->sendMessage($params);
    var_dump($result);
  } catch (AwsException $e) {
    // output error message if fails
    error_log($e->getMessage());
  }
}

// Para Usar na funcao que gera um log.
require 'log.php';

// Exemplo de Array de Logs
$log='[
      {"app":"peerbr",
      "nivel":"erro",
      "detalhes":"Erro Qualquer Agora",
      "mensagem":"Erro na execucao X",
      "ip":"177139154000","erro":""
      },
      {"app":"peerbr",
      "nivel":"info",
      "detalhes":"Erro Qualquer Agora",
      "mensagem":"Erro na execucao X",
      "ip":"177139154000","erro":""
      },
      ]';

// Chamada da Funcao;
enviarLog($log);
