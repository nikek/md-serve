const fs = require("fs");
const express = require("express");
const markdownIt = require("markdown-it")({ html: true }).use(
  require("markdown-it-admonition")
);

// setup the server
const app = express();

app.get("/:filename", (req, res) => {
  // create filepath to the docs file
  const filepath = __dirname + "/" + req.params.filename;

  // if file not exists: 404
  if (!fs.existsSync(filepath)) {
    res.status(404);
    res.end("file not found\n");
    return;
  }

  // try reading the file
  fs.readFile(filepath, "utf8", (err, md) => {
    // if reading file failed: 500
    if (err) {
      res.status(500);
      res.send("error reading file\n");
      return;
    }

    // we got the file content, let's try to transform it into html
    let html;
    try {
      html = markdownIt.render(md);
    } catch (e) {
      // failed to transform the md to html: 500
      console.log("md: " + md);
      res.status(500);
      res.send("error transforming md to html: " + e + "\n");
      return;
    }

    // return html string to browser
    res.send(html);
  });
});

// any other request is a bad request
app.get("*", (req, res) => {
  res.status(400);
  res.end("filename missing\n");
});

// setup server to listen to port 1234
app.listen(1234);
