rm server/db/dev.sqlite3
npm run knex migrate:latest
npm run knex seed:run
npm run dev
# log in via the browser and play a game till you win it — creates user id 1 (first time only)
npm run knex seed:run -- --specific=games.js
npm run knex seed:run -- --specific=guess.js