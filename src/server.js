// @flow

const http = require("http");
const fs = require("fs");
const ReactDOM = require("react-dom");
const ReactDOMServer = require("react-dom/server");

const view = require("./views/main");
const block = require("./blocks/main");


http.createServer(function (req, res){
  console.log(req.url);
  fs.readFile("public" + req.url, (err, buffer) => {
    if (err == null){
      if (req.url.endsWith(".js")){
        res.writeHead(200, "OK", { "Content-Type": "application/javascript" });
      }
      if (req.url.endsWith(".css")){
        res.writeHead(200, "OK", { "Content-Type": "text/css" });
      }
      res.write(buffer);
      res.end();
    } else {
      fs.readFile("index.html", (err, buffer) => {
        if (err == null){
          const html = buffer.toString("utf8");
          const initialState = block.initialize(null);

          // take URL and generate initial actions to apply to state (nav)

          const initialStateJSON = JSON.stringify(initialState);
          const initialElement = view(block.viewModel(initialState, a => {}));
          const initialElementHtml = ReactDOMServer.renderToString(initialElement);

          const html2 =
            html.replace('<script id="statePlaceholder"></script>',
                         `<script>window._initialState = ${initialStateJSON};</script>`)
                .replace('<div id="root">You don\'t have JavaScript installed! :(</div>',
                         `<div id="root">${initialElementHtml}</div>`);

          res.writeHead(200, "OK", { "Content-Type": "text/html" });
          res.write(html2);
          res.end();
        } else {
          console.log("not found...");
        }
      });
    }
  });
}).listen(5000);

console.log("App listening on port 5000...");
