FROM node:lts-alpine as base

COPY --chown=node:node package*.json ./
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./public ./public
COPY --chown=node:node ./.eslintrc.js ./
COPY --chown=node:node ./*.config.js ./
RUN npm install

FROM base as dev
ENV NODE_ENV development
EXPOSE 8080
CMD ["npm", "run", "serve"]

FROM base as build
RUN npm run build

FROM node:lts-alpine as prod
RUN npm install -g http-server
COPY --chown=node:node --from=build /dist /app/dist/

EXPOSE 8080
CMD [ "http-server", "dist" ]