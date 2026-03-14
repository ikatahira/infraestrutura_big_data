# 🏙️ PROJETO INTEGRADOR COMPLETO
## SmartCity Temperature Monitor

Este documento contém TODO o projeto integrador com código completo e instruções detalhadas para as Semanas 10, 19 e 20.

---

## 📋 VISÃO GERAL

**Projeto:** Sistema de monitoramento de temperatura em tempo real para cidades inteligentes  
**Tecnologias:** ESP32, MQTT, Kafka, Spark, MongoDB, Flask  
**Duração:** 3 semanas (10, 19, 20)  
**Complexidade:** Intermediária  
**Grupo:** 3-4 alunos  

---

## 🏗️ ARQUITETURA

```
[ESP32 Sensores] → [MQTT Broker] → [Kafka] → [Spark Streaming] → [MongoDB] → [Dashboard Flask]
```

**Fluxo de Dados:**
1. **Ingestão:** ESP32 com DHT22 coletam temperatura e enviam via MQTT
2. **Messaging:** Mosquitto broker recebe e encaminha para Kafka
3. **Streaming:** Kafka mantém buffer das mensagens
4. **Processamento:** Spark Streaming processa, valida e agrega dados
5. **Armazenamento:** MongoDB guarda leituras e alertas
6. **Visualização:** Dashboard Flask exibe gráficos em tempo real

---

## 📁 ESTRUTURA DE ARQUIVOS

```
smartcity-temperature-monitor/
├── 1_iot_sensor/
│   └── esp32_dht22_mqtt.ino
├── 2_kafka/
│   ├── create_topic.sh
│   └── mqtt_to_kafka_bridge.py
├── 3_spark_processing/
│   └── temperature_processor.py
├── 4_mongodb/
│   └── setup.js
├── 5_dashboard/
│   ├── app.py
│   ├── templates/dashboard.html
│   └── static/style.css
├── requirements.txt
└── README.md
```

---

## CONTINUA NO GUIA PRINCIPAL

Veja o guia do professor para:
- Código completo de TODOS os arquivos
- Instruções passo a passo de instalação
- Troubleshooting detalhado
- Rubricas de avaliação
- Cronograma detalhado

