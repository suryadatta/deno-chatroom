import { serve } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std/ws/mod.ts";
import { chatConnection } from "./ws/chatroom.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

//const { args } = Deno;
const DEFAULT_PORT = 3000;
const argPort = parse(Deno.args).port;
// server setup
const server = serve({ port: argPort ? Number(argPort) : DEFAULT_PORT });
console.log(`port:${argPort}`);

for await (const req of server) {
  // serve index page
  if (req.url === "/") {
    req.respond({
      status: 200,
      body: await Deno.open("./public/index.html"),
    });
  }

  // accept the websocket connection
  if (req.url === "/ws") {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      }).then(chatConnection);
    }
  }
}
