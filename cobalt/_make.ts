#!/usr/bin/env -S deno run -A --no-check
import * as path from "https://deno.land/std@0.121.0/path/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.13.14/mod.js";
import * as async from "https://deno.land/std@0.121.0/async/mod.ts";
import * as log from "https://deno.land/std@0.121.0/log/mod.ts";
import * as make from "../make/mod.ts";
import * as mod from "../mod/mod.ts";

const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
const outputDir = path.join(currentDir, "build");
const clientEntry = path.join(currentDir, "client/mod.ts");
const serverEntry = path.join(currentDir, "server/mod.ts");

async function buildClient(dev: boolean) {
  log.info("Building client");
  await esbuild.build({
    entryPoints: [clientEntry],
    write: true,
    bundle: true,
    minify: !dev,
    outdir: path.join(outputDir, "statics"),
    plugins: [await mod.createEsbuildPluginHttp()],
  });
  esbuild.stop();
}

async function buildServer() {
  log.info("Building server");
  const process = Deno.run({
    cmd: ["deno", "compile", "-o", path.join(outputDir, "cobalt"), serverEntry],
    stdout: "piped",
    stderr: "piped",
  });
  await Promise.all([process.output(), process.status()]);
}

let serverProcess: undefined | Deno.Process;
function startServer() {
  if (serverProcess) {
    log.info("Restarting server");
    // Should I kill it here? Fails on Window though.
    serverProcess.close();
  } else {
    log.info("Starting server");
  }
  serverProcess = Deno.run({
    cmd: ["deno", "run", "-A", "--no-check", serverEntry],
    stdout: "inherit",
    stderr: "inherit",
  });
}

make.task("build", async () => {
  await buildClient(false);
  await buildServer();
});

make.task("dev", async () => {
  await buildClient(true);
  startServer();
  const watchClient = async () => {
    const watcher = mod.watchModule(clientEntry);
    const handle = async.debounce(() => buildClient(true), 300);
    for await (const event of watcher) {
      if (
        event.kind === "modify" ||
        event.kind === "create" ||
        event.kind === "remove"
      ) {
        handle();
      }
    }
  };
  const watchServer = async () => {
    const watcher = mod.watchModule(serverEntry);
    const handle = async.debounce(() => startServer(), 300);
    for await (const event of watcher) {
      if (
        event.kind === "modify" ||
        event.kind === "create" ||
        event.kind === "remove"
      ) {
        handle();
      }
    }
  };
  await Promise.all([watchClient(), watchServer()]);
});

await make.exec(Deno.args);
