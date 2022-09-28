# Project21-singmeasong

# Teste e2e
-front-end/cypress/e2e/createRecommendations.cy.js -> Teste a criação de uma nova recomendação de vídeo por meio do cy, e verifíca se realmente a recomendação foi criada.<br /><br />
-front-end/cypress/e2e/downvoteRecommendations.cy.js -> Cria um nova recomendação de vídeo acessando direto o back, e adiciona um down vote ao vídeo criado.<br /><br />
-front-end/cypress/e2e/upvoteRecommendations.cy.js -> Cria um nova recomendação de vídeo acessando direto o back, e adiciona um up vote ao vídeo criado.<br /><br />
-front-end/cypress/e2e/getRandomRecommendations.cy.js -> Cria um nova recomendação de vídeo acessando direto o back, entra na rota recommendations/random e verifica se o recomendação é recebida.<br /><br />
-front-end/cypress/e2e/getTopRecommendations.cy.js -> Cria um nova recomendação de vídeo acessando direto o back, entra na rota recommendations/top e verifica se o recomendação é recebida.<br /><br /><br />

# Teste de integração
@npm run test<br /><br />
-describe("/recommendations POST") -> 2 testes: (1) a criação de uma nova recommendação, recebendo o status 201, e (2) o envio de um body no formato errado, recebendo o status 422.<br /><br />
-describe("/recommendations/id/upvote POST") -> 1 teste: Adiciona um up vote a uma recomendação e espera status 200.<br /><br />
-describe("/recommendations/id/downvote POST") -> 2 testes: (1) adiciona um down vote a uma recomendação e espera status 200, (2) simula um caso de uma recomendação com > -5 votos, o que faz com que a recomendação seja deletada, esperando um status 404 quando tentamos dar mais um downvote na recomendação porém ela já foi deletada.<br /><br />
describe("/recommendations GET") -> 6 testes: Testa todas as rotas get<br /><br /><br />

Total de testes: 11<br /><br /><br />

# Teste unitário
@npm run test:unit -> Testa, na grande maioria, o sucesso das funções do service, com uma cobertura de 100%. dos 13 testes, 3 testam erro.<br /><br />

Total de testes: 13<br /><br /><br />

Arquivo .env:<br /><br />
PORT<br />
DATABASE_URL<br />
NODE_ENV<br />
