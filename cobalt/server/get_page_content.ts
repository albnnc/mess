export function getPageContent() {
  return template;
}

const template = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Cobalt</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background: rgb(30, 30, 30);
          color: rgb(200, 200, 200);
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <script type="module" src="/mod.js"></script>
      <app-root></app-root>
    </body>
  </html>
`;
