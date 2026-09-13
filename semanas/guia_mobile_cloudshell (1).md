# 📱 Guia de Acesso Mobile — Google Cloud Shell

**Para quem só tem celular.** Este guia mostra como rodar Hadoop, Kafka e MongoDB de verdade (não só simulados) direto do navegador do seu celular, usando o **Google Cloud Shell** — um terminal Linux completo, gratuito, que roda na nuvem do Google. Você não instala nada no seu aparelho.

## Semanas 07, 08 e 18 — use o Google Colab em vez do Cloud Shell

Se você já usa **Google Colab** nas outras disciplinas de Ciência de Dados (provavelmente usa), essas 3 semanas são mais fáceis de resolver por lá do que pelo Cloud Shell — porque não precisam de nenhum serviço rodando (nada de porta aberta, nada de container), só de Python com Spark instalado.

1. Acesse **colab.research.google.com** pelo navegador do celular
2. Crie um notebook novo
3. Na primeira célula, rode:
   ```python
   !pip install pyspark
   ```
4. Siga o script da semana normalmente — o Colab já tem tudo mais que você precisa (pandas, Python) pré-instalado

Isso é mais simples do que configurar o ambiente inteiro no Cloud Shell, e você já deve estar familiarizado com a interface do Colab de outras matérias.

## Semanas 01, 04, 05, 06, 10 e 11 — use o Cloud Shell (abaixo)

Essas semanas precisam de serviços reais rodando (HDFS, MongoDB, Kafka) — isso o Colab não oferece, porque cada célula roda isolada e não mantém processos de fundo por muito tempo. Para essas, siga o guia completo do Cloud Shell abaixo.

## O que você precisa

- Uma conta Google (Gmail) — se não tiver, é grátis criar uma
- Navegador Chrome no celular (funciona em outros, mas o Chrome dá menos problema)
- **Recomendado, mas opcional**: um teclado Bluetooth. Dá pra digitar tudo na tela, mas um teclado físico torna a experiência bem melhor para comandos longos

**Não precisa de cartão de crédito.** O Cloud Shell é gratuito e não faz parte do "Free Trial" da Google Cloud que pede cartão — é um benefício separado, sempre grátis, com limite de uso diário generoso o bastante para as atividades do curso.

## Passo 1 — Abrir o Cloud Shell

1. No Chrome do celular, acesse: **https://shell.cloud.google.com**
2. Faça login com sua conta Google
3. Espere a tela de terminal carregar (pode demorar 30-60s na primeira vez)
4. **Dica**: gire o celular para modo paisagem (deitado) — o terminal fica bem mais utilizável

Você agora tem um terminal Linux completo, com Docker já instalado, rodando na nuvem.

## Passo 2 — Criar os arquivos do ambiente

Cole estes comandos um de cada vez no terminal (pode copiar e colar, sem digitar):

```bash
mkdir -p ~/bigdata/hadoop ~/bigdata/dados && cd ~/bigdata
```

Crie o `docker-compose.yml`:

```bash
cat > docker-compose.yml << 'EOF'
services:
  hadoop:
    build: ./hadoop
    container_name: bigdata-hadoop
    ports:
      - "9870:9870"
      - "9000:9000"
    volumes:
      - ./dados:/dados
  kafka:
    image: bitnami/kafka:3.7
    container_name: bigdata-kafka
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - ALLOW_PLAINTEXT_LISTENER=yes
  mongodb:
    image: mongo:7
    container_name: bigdata-mongo
    ports:
      - "27017:27017"
EOF
```

Crie o `hadoop/Dockerfile` (a mesma receita da Semana 05):

```bash
cat > hadoop/Dockerfile << 'EOF'
FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y openjdk-11-jdk openssh-server openssh-client wget net-tools rsync && rm -rf /var/lib/apt/lists/*
RUN ssh-keygen -t rsa -P '' -f /root/.ssh/id_rsa && cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys && chmod 0600 /root/.ssh/authorized_keys
RUN wget -q https://downloads.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz && tar -xzf hadoop-3.3.6.tar.gz -C /usr/local && mv /usr/local/hadoop-3.3.6 /usr/local/hadoop && rm hadoop-3.3.6.tar.gz
ENV HADOOP_HOME=/usr/local/hadoop
ENV PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
RUN echo "export JAVA_HOME=$JAVA_HOME" >> $HADOOP_HOME/etc/hadoop/hadoop-env.sh
RUN echo '<configuration><property><name>fs.defaultFS</name><value>hdfs://localhost:9000</value></property></configuration>' > $HADOOP_HOME/etc/hadoop/core-site.xml
RUN echo '<configuration><property><name>dfs.replication</name><value>1</value></property></configuration>' > $HADOOP_HOME/etc/hadoop/hdfs-site.xml
RUN service ssh start && $HADOOP_HOME/bin/hdfs namenode -format -force
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 9870 9000
CMD ["/entrypoint.sh"]
EOF
```

```bash
cat > hadoop/entrypoint.sh << 'EOF'
#!/bin/bash
service ssh start
$HADOOP_HOME/sbin/start-dfs.sh
tail -f /dev/null
EOF
```

Crie o dataset de exemplo (o mesmo `vendas.csv` desde a Semana 01):

```bash
cat > dados/vendas.csv << 'EOF'
id,produto,categoria,preco,quantidade,data
1,Notebook,Eletrônicos,3500.00,2,2024-01-15
2,Cadeira Gamer,Móveis,850.50,5,2024-01-15
3,Monitor 4K,Eletrônicos,1200.00,3,2024-01-16
4,Teclado Mecânico,Periféricos,320.00,10,2024-01-16
5,Smartphone,Eletrônicos,2800.00,8,2024-01-17
6,Mesa de Escritório,Móveis,650.00,2,2024-01-17
7,Headset,Periféricos,180.00,15,2024-01-18
8,Webcam HD,Periféricos,220.00,7,2024-01-18
EOF
```

## Passo 3 — Subir o ambiente

```bash
docker compose up -d
```

Na primeira vez demora alguns minutos (o Cloud Shell precisa baixar as imagens e compilar o Hadoop). Depois disso, é rápido.

Verifique se está tudo de pé:

```bash
docker compose ps
```

## Passo 4 — Acessar a interface web do Hadoop pelo celular

O Cloud Shell tem um recurso chamado **Web Preview** que expõe uma porta do terminal como um link HTTPS normal — funciona direto no navegador do celular:

1. No topo do Cloud Shell, toque no ícone de **olho / "Web Preview"** (se não aparecer no celular, toque no menu ☰ do Cloud Shell)
2. Escolha **"Change port"** e digite **9870**
3. Ele abre uma nova aba com a interface web do NameNode — exatamente a mesma tela que os colegas com PC estão vendo em `localhost:9870`

## Passo 5 — Rodar os comandos de cada semana

Sempre dentro do terminal do Cloud Shell:

**Semana 05 — HDFS:**
```bash
docker exec -it bigdata-hadoop bash
hdfs dfs -mkdir -p /user/hadoop/dados
hdfs dfs -put /dados/vendas.csv /user/hadoop/dados/
hdfs dfs -ls /user/hadoop/dados/
```

**Semana 10 — MongoDB:**
```bash
docker exec -it bigdata-mongo mongosh
```

**Semana 11 — Kafka:**
```bash
docker exec -it bigdata-kafka bash
kafka-topics.sh --create --topic cliques --bootstrap-server localhost:9092
```

## Coisas importantes de saber

- **O Cloud Shell "esquece" a máquina depois de ficar muito tempo parado** (geralmente ~20-60 min inativo, ou ao fechar o navegador por muito tempo). Os **arquivos que você criou continuam salvos** (o Cloud Shell guarda 5 GB do seu `$HOME` para sempre), mas os **containers Docker precisam ser religados** com `docker compose up -d` de novo quando voltar.
- Isso é ótimo para estudar, mas **não é o ambiente de produção real** — é uma forma de acompanhar a aula e praticar os comandos sem precisar de um computador com Linux instalado.
- Se o Cloud Shell parar de funcionar por algum motivo (limite de uso do dia, por exemplo), a alternativa é o **GitHub Codespaces** (60 horas grátis por mês com conta GitHub, também roda no navegador e suporta Docker) — o mesmo `docker-compose.yml` funciona lá também.

## Resumo rápido

| Quero fazer | Comando/ação |
|---|---|
| Abrir terminal na nuvem | shell.cloud.google.com |
| Subir tudo | `docker compose up -d` |
| Ver se está rodando | `docker compose ps` |
| Ver a tela do Hadoop | Web Preview → porta 9870 |
| Entrar no Hadoop | `docker exec -it bigdata-hadoop bash` |
| Entrar no MongoDB | `docker exec -it bigdata-mongo mongosh` |
| Entrar no Kafka | `docker exec -it bigdata-kafka bash` |
| Desligar tudo | `docker compose down` |
