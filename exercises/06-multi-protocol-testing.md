# Exercise 06: Multi-Protocol Testing

- Test WebSocket connections with k6/ws module
- Test gRPC services with k6/net/grpc module
- Compare protocol performance characteristics


Create `ws-exercise.js`:
```javascript
import ws from "k6/ws";
import { check } from "k6";

export default function () {
  const url = "wss://echo.websocket.org";
  const res = ws.connect(url, {}, function (socket) {
    socket.on("open", () => socket.send("Hello from k6!"));
    socket.on("message", (msg) => {
      console.log("Received:", msg);
      socket.close();
    });
  });
  check(res, { "ws status is 101": (r) => r && r.status === 101 });
}
```
Run with: `k6-ws ws-exercise.js`

Create `grpc-exercise.js`:
```javascript
import grpc from "k6/net/grpc";
import { check } from "k6";

const client = new grpc.Client();

export default function () {
  client.connect("grpcbin.test.k6.io:9001", { plaintext: false });
  const response = client.invoke("hello.HelloService/SayHello", {
    greeting: "k6 exercise",
  });
  check(response, {
    "gRPC status OK": (r) => r && r.status === grpc.StatusOK,
  });
  client.close();
}
```
Run with: `k6-grpc grpc-exercise.js`

Run HTTP, WebSocket, and gRPC tests side by side:
```bash
k6 run --duration 10s samples/http-load-test.js
k6 run --duration 10s samples/websocket-test.js
k6 run --duration 10s samples/grpc-test.js
```
Compare latency, throughput, and error rates across protocols.

- WebSocket connection established (status 101)
- gRPC unary call succeeds (StatusOK)
- Comparative metrics across all three protocols

- You can test WebSocket connection lifecycle
- You can test gRPC unary calls with response validation
- You understand performance differences between HTTP, WebSocket, and gRPC

