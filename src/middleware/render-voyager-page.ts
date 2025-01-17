const { version } = require('../package.json');

export interface MiddlewareOptions {
  endpointUrl: string;
  displayOptions?: object;
  headersJS?: string;
}

export default function renderVoyagerPage(options: MiddlewareOptions) {
  const { endpointUrl, displayOptions } = options;
  const headersJS = options.headersJS ? options.headersJS : '{}';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8 />
  <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
  <title>GraphQL Voyager</title>
  <style>
    body {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    #voyager {
      height: 100vh;
    }
  </style>
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/graphql-voyager@${version}/dist/voyager.css"
  />
  <script src="https://cdn.jsdelivr.net/npm/graphql-voyager@${version}/dist/voyager.standalone.js"></script>
</head>
<body>
  <main id="voyager">
    <h1 style="text-align: center; color: #5d7e86;"> Loading... </h1>
  </main>
  <script type="module">
    window.addEventListener('load', async function(event) {
      const response = await fetch('${endpointUrl}', {
        method: 'post',
        headers: Object.assign({}, {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, ${headersJS}),
        body: JSON.stringify({
          query: GraphQLVoyager.voyagerIntrospectionQuery,
        }),
        credentials: 'include',
      });
      const introspection = await response.json();

      GraphQLVoyager.renderVoyager(document.getElementById('voyager'), {
        introspection,
        displayOptions: ${JSON.stringify(displayOptions)},
      });
    })
  </script>
</body>
</html>
`;
}
