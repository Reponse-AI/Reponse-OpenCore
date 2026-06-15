import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: '../openapi.yaml',
  output: {
    path: 'src/gen',
  },
  types: {
    enums: 'javascript',
  }
});
