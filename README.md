# GameLog

Plataforma para registrar os jogos que você joga, avaliar o que zerou e acompanhar o que seus amigos estão jogando.
Projeto das disciplinas de Programação Orientada a Objetos e Banco de Dados II.

Rafael Stefan de Oliveira Bertolez e João Pedro Benevides Montoro.

## Tecnologias

- **Backend:** Java 21, Spring Boot 4, Spring Security com JWT em cookie HttpOnly, Spring Data JPA (Hibernate).
- **Banco de dados:** PostgreSQL 17 em Docker.
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4 e shadcn/ui.

## Como rodar

Pré-requisitos: Docker, Java 21 ou mais novo e Node.js 20 ou mais novo.

1. Suba o banco:

   ```bash
   docker compose up -d
   ```

2. Popule o banco com os dados de demonstração:

   ```bash
   docker exec -i gamelog-postgres psql -U gamelog -d gamelog < banco/popular.sql
   ```

3. Rode o backend (porta 8080):

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. Em outro terminal, rode o frontend (porta 3000):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Acesse http://localhost:3000.

## Contas de demonstração

Todas as contas usam a senha `senha1234`.

| Perfil | E-mail |
|---|---|
| Administrador | `admin@gamelog.com` |
| Usuário comum | `ana.souza@gamelog.com` |

O banco de demonstração tem outras pessoas, 20 jogos com capa, runs, avaliações e amizades.

## Funcionalidades

- Cadastro, login e edição do perfil (nome, foto e senha).
- Catálogo de jogos com busca por título e filtros por gênero e plataforma.
- Biblioteca pessoal com runs (Jogando, Zerado, Rejogando e Desistido), horas jogadas e datas.
- Avaliação com nota de 0 a 10 e comentário para runs zeradas, rejogadas ou abandonadas.
- Amizades com pedido e aceite, busca de pessoas e perfil com estatísticas.
- Página inicial com destaques e feed de atividades dos amigos e da comunidade.
- Administração: catálogo de jogos, suspensão e reativação de contas, promoção a administrador, exclusão de avaliações e log de auditoria.
- Limite de requisições: 5 tentativas de login a cada 10 minutos e 30 pesquisas por minuto.

## Estrutura

```
backend/   API REST em Spring Boot (controllers, services, repositories, entities, security, auditoria)
frontend/  aplicação Next.js
banco/     script de população do banco
```

## Configuração

O backend já vem com valores de desenvolvimento.
Para produção, defina a variável de ambiente `GAMELOG_JWT_SEGREDO` com um segredo próprio em Base64 e ative o cookie seguro (`gamelog.cookie.secure=true`).
