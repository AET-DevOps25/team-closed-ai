FROM node
WORKDIR /app
COPY package.json .
RUN npm install
# fixes `Cannot start service: Host version "0.25.4" does not match binary version "0.25.5"`for now
RUN npm install esbuild@0.25.4 --save-exact
RUN npm i -g serve
COPY . .

# Sets the API URL to the value of the VITE_API_URL environment variable
RUN mv .env.production.example .env.production

RUN npm run build

COPY env.sh /app/env.sh
RUN chmod +x /app/env.sh

EXPOSE 3000
CMD ["/app/env.sh"]
