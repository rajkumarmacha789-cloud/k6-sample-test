// samples/websocket-test.js — WebSocket Connection Lifecycle Test
// This sample demonstrates: WebSocket connect, send, receive, and latency.
//
// Run with: k6 run samples/websocket-test.js

import ws from "k6/ws";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

// Custom metric: track WebSocket message round-trip latency
const wsLatency = new Trend("ws_message_latency");

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    ws_message_latency: ["p(95)<200"], // 95th percentile under 200ms
  },
};

export default function () {
  const url = "wss://echo.websocket.org";

  // Open a WebSocket connection
  const res = ws.connect(url, {}, function (socket) {
    // On connection open: send a message
    socket.on("open", function () {
      socket.send(JSON.stringify({ action: "ping", ts: Date.now() }));
    });

    // On message received: measure latency
    socket.on("message", function (msg) {
      try {
        const data = JSON.parse(msg);
        if (data.ts) {
          wsLatency.add(Date.now() - data.ts);
        }
      } catch (e) {
        // Echo server returns raw message
        wsLatency.add(0);
      }

      // Send another message after receiving
      socket.send(JSON.stringify({ action: "ping", ts: Date.now() }));
    });

    // On error: log it
    socket.on("error", function (e) {
      console.error("WebSocket error:", e.error());
    });

    // Close the connection after 5 seconds
    socket.setTimeout(function () {
      socket.close();
    }, 5000);
  });

  // Validate the WebSocket connection was successful
  check(res, {
    "ws status is 101": (r) => r && r.status === 101,
  });

  sleep(1);
}

