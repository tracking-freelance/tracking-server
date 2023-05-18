FROM node:18-alpine as build

WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .
RUN npx prisma generate
RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm i --omit=dev

COPY --from=build /app/dist ./
COPY --from=build /app/prisma ./prisma

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

RUN npx prisma generate
CMD [ "node", "main.js" ]