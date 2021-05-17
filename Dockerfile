FROM node:14-alpine

WORKDIR /app

COPY . .

RUN NODE_ENV=docker-development yarn global add typescript nodemon ts-node
RUN NODE_ENV=docker-development yarn

# Development
CMD ["yarn", "dev"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]