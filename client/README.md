# React + TypeScript + Vite

This is the client for the ClosedId application build during the DevOps course.

The frontend runs locally at: http://localhost:5173/

## Development with Docker

In the root of the project use the following command to start the client & server:

```
docker compose up -d
```

to ensure it builds (if necessary):

```
docker compose up --build -d
```

## Development without Docker

Create a `.env.development` and `.env.production` from the respective example files.

To run the client and use the locally running server:

```
npm run dev:local
```

To run the client and use the deployed server:

```
npm run dev:prod
```

## OpenAPI Client Generation

To generate/update the clients for the server, use the following command in the client directory:

```
openapi-generator generate -i ../server/openapi.yaml -o src/api -g typescript-axios --skip-validate-spec
```

## UI library

As design library we use [Shadcn](https://ui.shadcn.com/), which is (almost) industry standard. See their documentation to see a full list of components.

In case you want to use a component, which is not yet used in our application, use the following command:

```
npx shadcn@latest add button
```

This will auto generate the specified components within the components folder.
