# Projeto para Sistema Interno do Crédito Imobiliário do Banestes
Este projeto se trata de um Sistema Interno para a equipe da GECRI, referente ao Crédito Imobiliário do Banco. <br>
Mais pra frente tivemos algumas outras implementações relacionadas e este escopo de melhorias na gerência.

## Escopo geral
Este projeto tem como premissa a otimização do processo de contratação de crédito imobiliário dentro da GECRI. <br>
Há um incômodo referente ao processo manual das etapas e a perda de informações ao longo do processo (que pode demorar meses), por isso
se faz necessário a implementação de um sistema, bem como um banco de dados. <br>
Fizemos uma CRUD com tratativas de regra de negócio, validações de entrada e controles de saída.
Além desses pontos, também há a necessidade de se adaptar a realidade do banco em relação a tecnologias utilizadas, uma limitação em relação ao desenvolvimento.
Por isso, escolhemos tecnologias como Handlebars, Postgresql e Express, se adaptando ao que o banco tem de disponível.

## Tecnologias
Neste projeto, usei algumas tecnologias que já havia tido contato antes e as escolhi por conta de algumas limitações que o Banco impõe referente ao desenvolvimento de aplicações.
Foram utilizadas Handlebars, Postgresql e Express.

### Anotações:
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused (0x0000274D/10061)
        Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused (0x0000274D/10061)
        Is the server running on that host and accepting TCP/IP connections?

resolution: pg_ctl -D ^"C^:^\Users^\030088259^\programas^\PostgreSQL^\data^" -l arquivolog start

obs: para interromper = pg_ctl -D ^"C^:^\Users^\030088259^\programas^\PostgreSQL^\data^" -l arquivolog stop

-------

Dependencias:
        - node_modules: npm i

        - /backend/rotas/datas/
        
        - arquivo .env:
        CONNECTION_STRING=postgres://usuario:senha@host:port/database
        PORT=8080

obs: A porta do CONNECTION_STRING determina a porta que o PostGre está rodando.
     A porta do PORT determina a porta que o App.js está rodando.
