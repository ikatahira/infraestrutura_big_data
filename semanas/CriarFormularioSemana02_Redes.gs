/**
 * CriarFormularioSemana02_Redes.gs
 * ---------------------------------------------------------
 * Gera automaticamente um Google Formulário (modo Quiz) com
 * 10 perguntas de reforço sobre "Fundamentos de Redes" da
 * Semana 02 (Missões 1, 2 e 3), incluindo alternativas,
 * resposta correta, pontuação e feedback.
 *
 * Este quiz é OPCIONAL — reforço de fixação, não substitui
 * as 3 missões da própria página semana02.html.
 *
 * COMO USAR:
 * 1. Acesse https://script.google.com/ e clique em "Novo projeto"
 *    (ou, numa planilha Google, vá em Extensões > Apps Script).
 * 2. Apague o conteúdo padrão e cole todo este arquivo.
 * 3. No menu superior, selecione a função "criarFormularioSemana02Redes"
 *    e clique em "Executar" (▶).
 * 4. Na primeira execução, autorize o script (sua própria conta Google).
 * 5. Ao concluir, veja o Log (Ctrl+Enter) para os links de edição e
 *    de resposta do formulário.
 * 6. Copie o link de respostas e cole no box "Quiz de fixação —
 *    Fundamentos de Redes" da semana02.html.
 * ---------------------------------------------------------
 */

function criarFormularioSemana02Redes() {
  // ===========================
  //  1. DADOS DO QUIZ (fonte: semana02.html — Missões 1, 2 e 3)
  // ===========================
  var QUESTIONS = [
    {
      q: 'O que é um endereço IP?',
      opts: ['O nome de um site na internet', 'O "endereço de rua" de uma máquina na rede', 'Um tipo de protocolo de segurança', 'O nome de um serviço rodando na máquina'],
      correct: 1,
      feedback: 'O endereço IP é o "endereço de rua" de uma máquina na rede (ex: 192.168.1.10). Pode ser IPv4 ou IPv6, e redes locais costumam usar faixas privadas como 192.168.x.x ou 10.x.x.x.'
    },
    {
      q: 'Qual a diferença entre um endereço IP e uma porta?',
      opts: ['São a mesma coisa', 'O IP identifica a máquina; a porta identifica o serviço específico dentro dela', 'A porta identifica a máquina; o IP identifica o serviço', 'Porta só existe em redes sem fio'],
      correct: 1,
      feedback: 'O IP é o "endereço de rua" da máquina; a porta é o "número do apartamento" — permite que uma mesma máquina rode vários serviços ao mesmo tempo (web, SSH, banco de dados), cada um numa porta diferente.'
    },
    {
      q: 'O que o protocolo TCP/IP garante na comunicação entre máquinas?',
      opts: ['Que a internet nunca cai', 'Um "idioma" combinado para trocar dados sem perder nada no caminho', 'Que os dados sejam sempre criptografados', 'Que o DNS resolva nomes automaticamente'],
      correct: 1,
      feedback: 'O TCP/IP é o "idioma" combinado entre as máquinas para trocar dados de forma confiável, mesmo que a mensagem precise passar por várias redes intermediárias até chegar ao destino.'
    },
    {
      q: 'O que o DNS resolve?',
      opts: ['Problemas de segurança de rede', 'Traduz nomes fáceis de lembrar (como google.com) para o IP real da máquina', 'A velocidade da conexão de internet', 'Conflitos de porta entre serviços'],
      correct: 1,
      feedback: 'O DNS é o "catálogo de nomes" da internet: traduz nomes fáceis de lembrar (google.com) para o endereço IP real da máquina, já que decorar números seria inviável.'
    },
    {
      q: 'No modelo cliente-servidor, o que caracteriza o "cliente"?',
      opts: ['É quem armazena todos os dados', 'É quem pede algo (ex: um terminal rodando hdfs dfs -ls)', 'É sempre o servidor mais potente da rede', 'É um tipo de protocolo de rede'],
      correct: 1,
      feedback: 'No modelo cliente-servidor, o cliente é quem pede algo (ex.: seu terminal rodando hdfs dfs -ls) e o servidor é quem responde (ex.: o NameNode do Hadoop). A maioria dos serviços de Big Data segue esse padrão.'
    },
    {
      q: 'O que caracteriza o padrão de arquitetura master/worker, usado por ferramentas como Hadoop, Spark e Kafka?',
      opts: ['Todos os nós têm exatamente a mesma função', 'Um (ou poucos) nós master coordenam o trabalho, e vários nós worker executam as tarefas', 'O master é sempre o nó mais lento do cluster', 'Não existe comunicação entre master e workers'],
      correct: 1,
      feedback: 'No padrão master/worker, um (ou poucos) nós master coordenam o trabalho, enquanto vários nós worker executam as tarefas de fato. É a rede que permite essa coordenação acontecer entre os nós.'
    },
    {
      q: 'Por que é preciso liberar portas específicas entre os nós de um cluster real?',
      opts: ['Não é preciso, portas são liberadas automaticamente', 'Um firewall pode bloquear a comunicação entre os nós se as portas não estiverem abertas — causa comum de "cluster não funciona"', 'Portas só importam para acesso externo à internet', 'Isso só se aplica a clusters muito grandes (1000+ nós)'],
      correct: 1,
      feedback: 'Em um cluster real, é preciso liberar portas específicas entre os nós (ex.: a porta 9870 do NameNode) para que a comunicação não seja bloqueada por segurança — uma das causas mais comuns de "cluster não funciona" no mundo real.'
    },
    {
      q: 'Qual comando Linux mostra o(s) endereço(s) IP configurado(s) na máquina?',
      opts: ['ping', 'ip a', 'curl', 'nslookup'],
      correct: 1,
      feedback: 'O comando "ip a" (ou "ifconfig" em versões mais antigas) lista as interfaces de rede da máquina e seus respectivos endereços IP.'
    },
    {
      q: 'Qual comando permite ver quais portas estão abertas (em escuta) em uma máquina Linux?',
      opts: ['ping -c 4', 'sudo ss -tulnp', 'dig google.com', 'curl -I'],
      correct: 1,
      feedback: '"sudo ss -tulnp" lista as portas TCP (-t) e UDP (-u) em escuta (-l), de forma numérica (-n), mostrando o processo responsável (-p) por cada uma.'
    },
    {
      q: 'O comando "curl -I https://www.google.com" retornou "HTTP/2 200" no terminal. O que isso significa?',
      opts: ['Houve um erro de conexão', 'O servidor respondeu com sucesso ao pedido do cliente (curl)', 'A porta 200 está sendo usada', 'O DNS não conseguiu resolver o domínio'],
      correct: 1,
      feedback: '"HTTP/2 200" indica que o servidor respondeu com sucesso (código 200 = OK) ao pedido feito pelo cliente (o curl, neste caso) — o mesmo modelo cliente-servidor usado por qualquer ferramenta de Big Data.'
    }
  ];

  var PONTOS_POR_QUESTAO = 1; // ajuste aqui se quiser outra pontuação

  // ===========================
  //  2. CRIAÇÃO DO FORMULÁRIO
  // ===========================
  var form = FormApp.create('Quiz de Fixação — Fundamentos de Redes (Semana 02)');
  form.setDescription(
    'Tecnologia em Ciência de Dados · IAL008 · Semana 02 · Fundamentos de Redes\n' +
    'Quiz OPCIONAL de reforço — não substitui as 3 missões da página. ' +
    '10 questões, ' + PONTOS_POR_QUESTAO + ' ponto(s) cada.'
  );
  form.setIsQuiz(true);
  form.setCollectEmail(true);
  form.setShowLinkToRespondAgain(false);

  // Campo de identificação (nome do aluno)
  form.addTextItem()
    .setTitle('Nome completo')
    .setRequired(true);

  // Perguntas do quiz
  QUESTIONS.forEach(function (item, index) {
    var mcItem = form.addMultipleChoiceItem();
    mcItem.setTitle('Q' + (index + 1) + '. ' + item.q);
    mcItem.setRequired(true);
    mcItem.setPoints(PONTOS_POR_QUESTAO);

    var choices = item.opts.map(function (optText, optIndex) {
      return mcItem.createChoice(optText, optIndex === item.correct);
    });
    mcItem.setChoices(choices);

    mcItem.setFeedbackForCorrect(
      FormApp.createFeedback().setText('✅ Correto! ' + item.feedback).build()
    );
    mcItem.setFeedbackForIncorrect(
      FormApp.createFeedback().setText('❌ Incorreto. ' + item.feedback).build()
    );
  });

  // ===========================
  //  3. LOG DOS LINKS FINAIS
  // ===========================
  Logger.log('Formulário criado com sucesso!');
  Logger.log('Link de edição (professor): ' + form.getEditUrl());
  Logger.log('Link de respostas (compartilhar com os alunos): ' + form.getPublishedUrl());

  return {
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl()
  };
}
