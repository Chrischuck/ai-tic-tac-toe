const express = require('express')
const cors = require('cors')
const compression = require('compression')

const app = express()
app.use(cors())
app.use(compression())

const PORT = 3000

app.get('/', function (req, res) {
  res.contentType("application/wasm");
  res.sendFile(__dirname + '/go/main.wasm')
})

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("❤️  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});