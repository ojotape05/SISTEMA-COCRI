## Projeto para Sistema Interno do Crédito Imobiliário do Banestes
Este projeto se trata de um Sistema Interno para a equipe da GECRI, referente ao Crédito Imobiliário do Banco. <br>
Mais pra frente tivemos algumas outras implementações relacionadas e este escopo de melhorias na gerência.

# Anotações:
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
