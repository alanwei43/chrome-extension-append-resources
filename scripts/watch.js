import { watchFile } from "node:fs";
import * as vite from "vite";
import { iterateFiles } from "node-io-core";


for (const file of iterateFiles("src", {})) {
  console.log(`[${new Date().toLocaleTimeString()}] watch: ${file.fullPath}`);
  watchFile(file.fullPath, {
    "interval": 1000
  }, () => {
    console.log(`[${new Date().toLocaleTimeString()}] ${file.relativePath} has changed.`)
    runBuild();
  });
}

function runBuild() {
  debounce(_runBuild, 3_000)();
}
function _runBuild() {
  console.log(`\n[${new Date().toLocaleTimeString()}] start build`)
  vite.build().then(() => {
    console.log(`[${new Date().toLocaleTimeString()}] finish build\n`)
  });
}


function debounce(func, delay,) {
  return function (...args) {
    const timer = func._id;
    if (timer) {
      clearTimeout(timer);
    }
    func._id = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

runBuild();
