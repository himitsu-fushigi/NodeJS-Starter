const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const process = require("process");
const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // @dev Fork workers i.e. Integrate CPU core.
  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker) =>
    console.log(`worker ${worker.process.pid} died`)
  );
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer(require("./app")).listen(PORT, (err) => {
    if (err) return console.log(err);
  });

  console.log(`Worker ${process.pid} started`);
}
