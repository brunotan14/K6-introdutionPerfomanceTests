# 🚀 k6-curso — Testes de Carga e API Mock

Projeto de **testes de carga** com [k6](https://k6.io) e **API mockada** com [WireMock](https://wiremock.org), focado em cenários de **consulta de CEP** e **login**.

---

## 📋 Índice

- [O que este projeto faz?](#-o-que-este-projeto-faz)
- [Tecnologias do projeto](#-tecnologias-do-projeto)
- [Glossário para iniciantes](#-glossário-para-iniciantes)
- [Pré-requisitos](#-pré-requisitos)
- [Comandos explicados](#-comandos-explicados)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como rodar os testes](#-como-rodar-os-testes)
- [Dicas e próximos passos](#-dicas-e-próximos-passos)

---

## 🎯 O que este projeto faz?

- **Simula usuários** acessando uma API (como se muitas pessoas usassem o sistema ao mesmo tempo).
- Usa uma **API falsa (mock)** em `localhost:8080` para não depender de serviços reais.
- **Valida** se as respostas estão corretas (status 200, 400, 500, tempo de resposta, conteúdo JSON).

Ou seja: é um **curso prático de testes de carga** com k6 + mock de API.

---

## 🛠 Tecnologias do projeto

| Tecnologia | O que é (em poucas palavras) | Onde aparece no projeto |
|------------|------------------------------|--------------------------|
| **k6** | Ferramenta de **teste de carga** e performance. Roda scripts em JavaScript e simula muitos usuários acessando sua API. | Pasta `tests/` — todos os arquivos `.js` |
| **WireMock** | Servidor que **imita uma API real**. Você define “se vier essa URL, devolva essa resposta”, sem banco nem backend. | Pastas `mappings/` e `__files/` |
| **JavaScript (ES Modules)** | Linguagem dos scripts do k6. Usa `import` (ex.: `import http from 'k6/http'`). | Arquivos em `tests/*.js` |
| **JSON** | Formato de dados usado em requisições e respostas das APIs (e nos mocks). | `mappings/*.json`, `__files/*.json` |
| **Git** | Controle de versão do código (histórico, branches, etc.). | Pasta `.git/` e comandos `git` |

---

## 📖 Glossário para iniciantes

- **API** — Interface que sistemas usam para se comunicar (ex.: app envia “me dá o CEP X” e recebe os dados).
- **Mock / API mockada** — API “de mentira” que devolve respostas combinadas, sem servidor real.
- **Teste de carga** — Testar o sistema com muitos acessos ao mesmo tempo para ver se aguenta.
- **VU (Virtual User)** — “Usuário virtual”: cada VU é uma simulação de uma pessoa usando a API.
- **Status HTTP** — Código numérico da resposta: `200` = sucesso, `400` = erro do cliente, `500` = erro no servidor.
- **CEP** — No contexto do projeto: endpoint que “busca” dados de um CEP (aqui é mockado).
- **Endpoint** — Uma “porta” da API (ex.: `/login/`, `/ws/58042019/json/`).
- **Payload** — Dados enviados no corpo da requisição (ex.: usuário e senha no login).
- **Stages (k6)** — Fases do teste: por exemplo, subir de 0 a 200 usuários e depois voltar a 0.

---

## ✅ Pré-requisitos

1. **k6 instalado** no seu computador ([como instalar](#instalando-o-k6)).
2. **WireMock** rodando na porta **8080** ([como subir](#subindo-o-wiremock)).
3. **Terminal** (Prompt de Comando, PowerShell, Terminal do VS Code, etc.).

---

## ⌨ Comandos explicados

### Instalando o k6

O k6 não usa Node.js; é um binário próprio.

**macOS (Homebrew):**

```bash
brew install k6
```

| Parte do comando | O que significa |
|------------------|-----------------|
| `brew` | Gerenciador de pacotes do macOS. |
| `install` | Instala um programa. |
| `k6` | Nome do programa a instalar. |

**Windows (Chocolatey):**

```powershell
choco install k6
```

**Linux (exemplo Debian/Ubuntu):**

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Conferir se instalou:**

```bash
k6 version
```

- **O que faz:** Mostra a versão do k6 instalada. Se aparecer algo como `k6 v0.xx.x`, está ok.

---

### Subindo o WireMock

O projeto não inclui o binário do WireMock; você precisa tê-lo instalado ou usar Docker.

**Opção 1 — Com Docker (recomendado para leigos):**

```bash
docker run -d --name wiremock -p 8080:8080 -v $(pwd)/mappings:/home/wiremock/mappings -v $(pwd)/__files:/home/wiremock/__files wiremock/wiremock
```

| Parte do comando | O que significa |
|------------------|-----------------|
| `docker run` | Cria e inicia um container. |
| `-d` | Roda em segundo plano (não trava o terminal). |
| `--name wiremock` | Nome do container para referência. |
| `-p 8080:8080` | Expõe a porta 8080 do container na sua máquina. |
| `-v $(pwd)/mappings:...` | Usa a pasta `mappings` do projeto dentro do container. |
| `wiremock/wiremock` | Imagem oficial do WireMock no Docker Hub. |

**Importante:** Execute esse comando **na pasta raiz do projeto** (onde estão as pastas `mappings` e `__files`).

**Opção 2 — JAR (Java):**

Se você tem Java instalado, pode baixar o JAR do WireMock e rodar:

```bash
java -jar wiremock-standalone-3.x.x.jar --port 8080 --root-dir .
```

(Ainda assim é necessário apontar `--root-dir` para a pasta que contém `mappings` e `__files`.)

**Conferir se o mock está no ar:**

- Abra no navegador: `http://localhost:8080/ws/58042019/json/`  
- Ou no terminal: `curl http://localhost:8080/ws/58042019/json/`  
- Você deve receber um JSON com dados de CEP (mockado).

---

### Rodando os testes (k6)

Todos os comandos abaixo devem ser executados **na pasta do projeto** (ou com o caminho correto até o script).

**Teste de CEP com sucesso (e carga em stages):**

```bash
k6 run tests/test-cepsucess.js
```

| Parte do comando | O que significa |
|------------------|-----------------|
| `k6` | Programa do k6. |
| `run` | Executa um script. |
| `tests/test-cepsucess.js` | Caminho do arquivo do teste. |

**Teste de CEP inválido (espera status 400):**

```bash
k6 run tests/test-cep500.js
```

**Teste de login com sucesso (status 200):**

```bash
k6 run tests/test-loginsucesso.js
```

**Teste de login com erro 500:**

```bash
k6 run tests/test-login500.js
```

**Rodar com mais detalhes (modo “verbose”):**

```bash
k6 run --verbose tests/test-loginsucesso.js
```

**Rodar com 10 VUs por 30 segundos (sobrescreve o que está no script):**

```bash
k6 run --vus 10 --duration 30s tests/test-loginsucesso.js
```

| Parâmetro | Significado |
|-----------|-------------|
| `--vus 10` | 10 usuários virtuais. |
| `--duration 30s` | Duração total do teste: 30 segundos. |

---

## 📁 Estrutura do projeto

```
k6-curso/
├── README.md                 # Este arquivo
├── mappings/                 # Configurações do WireMock (quando responder o quê)
│   ├── cep-dinamico.json     # GET /ws/{cep}/json/ → resposta 200 com arquivo
│   ├── cep-invalido.json     # GET /ws/{cep}/json/ → 400 (CEP não encontrado)
│   ├── login-sucesso.json    # POST /login/ com user/senha certos → 200
│   └── login-erro-500.json   # POST /login/ com user/senha → 500
├── __files/                  # Corpos de resposta usados pelo WireMock
│   ├── cep-58042019.json
│   ├── cep-65243109.json
│   └── cep-78936120.json
└── tests/                    # Scripts de teste k6
    ├── test-cepsucess.js     # CEP sucesso + stages de carga
    ├── test-cep500.js        # CEP inválido (400)
    ├── test-loginsucesso.js  # Login sucesso (200)
    └── test-login500.js      # Login erro 500
```

---

## 🏃 Como rodar os testes

1. **Suba o WireMock** na porta 8080 (veja [Subindo o WireMock](#subindo-o-wiremock)).
2. **Abra o terminal** na pasta do projeto.
3. **Execute um teste**, por exemplo:
   ```bash
   k6 run tests/test-loginsucesso.js
   ```
4. Leia o resumo no final: **checks** (quantos passaram), **http_reqs** (requisições), **iteration_duration**, etc.

Se o WireMock não estiver rodando, os testes vão falhar com erro de conexão (ex.: connection refused).

---

## 💡 Dicas e próximos passos

- **Ordem sugerida para estudar:**  
  `test-loginsucesso.js` → `test-login500.js` → `test-cep500.js` → `test-cepsucess.js` (este tem `stages`).
- **Alterar carga:** Edite o objeto `options` em `test-cepsucess.js` (stages) ou use `--vus` e `--duration` na linha de comando.
- **Trocar a API real pelo mock:** Nos scripts, a URL é `http://localhost:8080/...`. Para testar outro ambiente, altere a URL no script ou use variáveis de ambiente no k6.
- **Documentação oficial:**  
  - [k6](https://k6.io/docs/)  
  - [WireMock](https://wiremock.org/docs/)

---

*README pensado para quem está começando em testes de carga e APIs. Se algo não ficar claro, vale abrir uma issue ou ajustar este texto conforme o curso evoluir.*
