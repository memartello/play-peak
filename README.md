# Play Peak

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development on the root
$ pnpm run dev

# production mode
$ pnpm run start
``
```

## Database Installation

docker compose -f docker-compose-db.yml up -d

This will expose localhost:5433 to the host machine.

And the credentials are:

Username: playpeak
Password: playpeak

Database: PlayPeakDB

Also you can connect to the pg admin at localhost:5555:

Username: pgadmin4@pgadmin.org
Password: admin

## Generate migrations

### This should be done on the server project

pnmp run migrate

## Run migrations

### This should be done on the server project

pnmp run generate

## Seed the database

### This should be done on the server project

pnmp run drizzle:seed

## Database Connection

```bash
psql -h localhost -p 5433 -U playpeak -d PlayPeakDB
```
