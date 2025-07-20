FROM node
WORKDIR /app
COPY package.json .
RUN npm install
# fixes `Cannot start service: Host version "0.25.8" does not match binary version "0.25.4"`
RUN npm install esbuild@0.25.8 --save-exact
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]