# Semana 1 - Prática Linux Gamificada

## 📝 Descrição

Missão prática no Google Cloud Shell para aprender comandos Linux essenciais aplicados ao contexto de Big Data. Esta semana simula ambientes reais de clusters Hadoop, explorando conceitos de HDFS, MapReduce, Docker e monitoramento de recursos.

## 🎯 Objetivos

- Configurar e acessar ambiente Linux (Google Cloud Shell)
- Criar estrutura de Data Lake simulando zonas Bronze/Silver/Gold
- Implementar pipelines de processamento com operadores Unix
- Monitorar recursos de CPU e memória como um SRE
- Simular nós de cluster com containers Docker
- Praticar permissões e logs de auditoria
- Automatizar tarefas com scripts bash

---

## 📋 Entregas dos Exercícios

### Exercício 1: ⚡ Acessando o Ambiente (Nível Zero)

**Objetivo:** Configurar e verificar o ambiente Linux no Google Cloud Shell.

#### Comandos Executados:
```bash
# Verificar sistema operacional e arquitetura
uname -a

# Mostrar diretório atual
pwd
```

#### 📸 Print de Tela:
*[Inserir print mostrando a saída dos comandos `uname -a` e `pwd`]*

#### 🧠 Questão Respondida:
**Q: O que o comando `uname -a` retorna em um sistema Linux?**  
**R:** B) Exibe informações sobre o kernel e o sistema operacional. O comando mostra detalhes completos incluindo nome do kernel, hostname, versão do kernel, data de compilação e arquitetura do sistema.

---

### Exercício 2: 🗄️ Organização do Data Lake

**Objetivo:** Simular a estrutura de diretórios de um Data Lake com zonas de dados (arquitetura Medallion).

#### Comandos Executados:
```bash
# Criar estrutura de diretórios
mkdir -p bigdata/raw
mkdir -p bigdata/processed
mkdir -p bigdata/logs

# Verificar estrutura criada
ls -R bigdata

# Criar dataset fictício na zona raw
echo "id,nome,valor" > bigdata/raw/dados.csv
echo "1,produtoA,100" >> bigdata/raw/dados.csv
echo "2,produtoB,200" >> bigdata/raw/dados.csv

# Visualizar conteúdo gerado
cat bigdata/raw/dados.csv
```

#### 📸 Print de Tela:
*[Inserir print mostrando a estrutura de diretórios e o conteúdo do arquivo dados.csv]*

#### 🧠 Questão Respondida:
**Q: Em um Data Lake real com Hadoop HDFS, qual é a função da zona "raw" (bruta)?**  
**R:** C) Receber dados originais sem nenhum tratamento ou transformação. A zona raw (Bronze) é onde os dados são armazenados exatamente como chegam das fontes, sem qualquer processamento, permitindo reprocessamento futuro se necessário.

---

### Exercício 3: 🔁 Pipeline de Processamento

**Objetivo:** Simular processamento distribuído usando pipes do Linux (análogo ao MapReduce).

#### Comandos Executados:
```bash
# Pipeline de transformação: filtrar dados
cat bigdata/raw/dados.csv | grep produtoA > bigdata/processed/dados_filtrados.csv
cat bigdata/processed/dados_filtrados.csv

# Contar linhas (análogo ao COUNT no MapReduce)
cat bigdata/raw/dados.csv | wc -l

# Ordenar e remover duplicatas (análogo ao Reduce)
cat bigdata/raw/dados.csv | sort | uniq
```

#### 📸 Print de Tela:
*[Inserir print mostrando os resultados dos pipelines e o arquivo filtrado]*



**Exemplo de como inserir imagem:**
```markdown
![Descrição da imagem](./imagens/exercicio3_pipeline.png)
```

#### 🧠 Questão Respondida:
**Q: Qual das opções melhor descreve a analogia entre o operador pipe `|` do Linux e o modelo MapReduce?**  
**R:** C) Ambos passam dados de uma etapa para outra em cadeia, transformando progressivamente. O pipe encadeia comandos Unix assim como o MapReduce encadeia fases (Map → Shuffle → Reduce), onde cada etapa processa e passa dados para a próxima.

---

### Exercício 4: 📊 Monitoramento de Recursos

**Objetivo:** Monitorar CPU, memória e processos do sistema, simulando o papel de um SRE (Site Reliability Engineer).

#### Comandos Executados:
```bash
# Monitorar recursos do sistema
top
# (Pressionar Q para sair)

# Simular carga de CPU
yes > /dev/null &

# Verificar novamente com top e anotar o PID
top

# Finalizar o processo de carga
kill <PID>
```

#### 📸 Print de Tela:
*[Inserir print do comando `top` mostrando o processo `yes` consumindo CPU]*

#### 📝 Registro de Campo - Respostas:

**Q1: O que aconteceu com a CPU ao executar `yes > /dev/null`?**  
**R:** *[Descrever: A CPU de um núcleo foi para próximo de 100% de utilização, pois o comando `yes` gera uma saída infinita que é descartada em /dev/null, criando um loop que consome recursos continuamente]*

**Q2: Como isso afetaria um cluster Spark em produção com múltiplos jobs?**  
**R:** *[Descrever: Um processo consumindo 100% de CPU em um nó do cluster poderia degradar a performance de outros jobs, causar timeouts, aumentar latência e potencialmente fazer o ResourceManager marcar aquele nó como problemático ou indisponível]*

**Q3: Que estratégias podem ser usadas para evitar saturação de recursos?**  
**R:** *[Descrever: Configurar limites de recursos (CPU/memória) por job no YARN/Spark, implementar filas de prioridade, usar auto-scaling de nós, monitoramento proativo com alertas, e configurar fair scheduler para distribuir recursos equitativamente]*

---

### Exercício 5: 🐳 Containers — Simulando Nós de Cluster

**Objetivo:** Criar containers Docker simulando nós master e worker de um cluster Hadoop.

#### Comandos Executados:
```bash
# Verificar Docker instalado
docker --version

# Criar rede para o cluster
docker network create cluster-net

# Criar containers master e worker
docker run -dit --name master --network cluster-net ubuntu
docker run -dit --name worker --network cluster-net ubuntu

# Listar containers em execução
docker ps
```

#### 📸 Print de Tela:
*[Inserir print mostrando os containers master e worker rodando com `docker ps`]*

#### 🧠 Questão Respondida:
**Q: Em um cluster Hadoop real, qual é a função do NameNode (representado pelo container "master")?**  
**R:** *[A resposta completa está no HTML - provavelmente: Gerenciar os metadados do HDFS, controlando onde os blocos de dados estão armazenados nos DataNodes, sem armazenar os dados propriamente ditos]*

---

## 📊 Resultados Esperados

Ao concluir esta semana, você terá:
- ✅ Familiaridade com ambiente Linux e comandos básicos
- ✅ Compreensão da estrutura de Data Lakes (arquitetura Medallion)
- ✅ Experiência prática com pipelines de dados usando Unix pipes
- ✅ Conhecimento de monitoramento de recursos em sistemas distribuídos
- ✅ Fundamentos de containerização com Docker para clusters

## 📚 Referências

- Google Cloud Shell: https://shell.cloud.google.com/
- Arquitetura Medallion (Bronze/Silver/Gold)
- Hadoop HDFS e MapReduce
- Docker para clusters distribuídos
- Comandos Linux para SRE e DevOps
