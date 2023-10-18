FROM node:18-slim

RUN apt-get update && apt-get install -yq \
  build-essential \
  python3

RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

# ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh ./wait-for-it.sh

# CMD [ "/bin/bash", "-c", "./wait-for-it.sh db:5432 --timeout=0 --strict -- make db-migrate && npm start" ]

CMD ["bash", "-c", "make db-migrate && npm start"]