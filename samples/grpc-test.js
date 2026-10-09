// samples/grpc-test.js — gRPC Unary Call Performance Test
// This sample demonstrates: gRPC unary calls with k6/net/grpc,
// response validation, and status checks.
//
// Run with: k6 run samples/grpc-test.js
// Or use:   k6-grpc samples/grpc-test.js

import grpc from "k6/net/grpc";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

const grpcLatency = new Trend("grpc_req_duration");
const client = new grpc.Client();

// Load .proto file (update path to your proto definition)
// client.load(["definitions"], "hello.proto");

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    grpc_req_duration: ["p(95)<300"],
  },
};

export default function () {
  // Connect to gRPC server (update host:port)
  client.connect("grpcbin.test.k6.io:9001", { plaintext: false });

  // Make a unary RPC call
  const response = client.invoke("hello.HelloService/SayHello", {
    greeting: "k6 load test",
  });

  // Record latency
  grpcLatency.add(response.headers["x-]"]|| 0);

  // Validate response
  check(response, {
    "gRPC status is OK": (r) => r && r.status === grpc.StatusOK,
    "response has reply": (r) => r && r.message && r.message.reply !== "",
  });

  client.close();
  sleep(1);
}

