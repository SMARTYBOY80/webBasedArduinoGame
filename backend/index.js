const express = require("express");
const cors = require("cors");
const five = require("johnny-five");

const app = express();
app.use(cors());
app.use(express.json());

const board = new five.Board();

let clients = []; // SSE clients

// SSE route
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

const sendEvent = (data) => {
  clients.forEach((client) => client.write(`data: ${JSON.stringify(data)}\n\n`));
};

board.on("ready", () => {
  console.log("Arduino board ready!");
  const led = new five.Led(13);
  const leftButton = new five.Button(2);
  const rightButton = new five.Button(4);

  leftButton.on("press", () => {
    console.log("Left button pressed!");
    led.toggle();
    sendEvent({ left: true });
  });

  rightButton.on("press", () => {
    console.log("Right button pressed!");
    led.toggle();
    sendEvent({ right: true });
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
