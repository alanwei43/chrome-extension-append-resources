(async () => {
  console.log("insert @", new Date().toLocaleString());

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("content script receive message: ", msg);
    if (msg.action === "hello") {
      sendResponse("Hello world. @" + new Date().toLocaleString());
    }

    if (msg.action === "fetch") {
      (async () => {
        const { url, init, type } = msg.payload;
        const isJson = type === "json";
        const request = await fetch(url, init);
        const response = await (isJson ? request.json() : request.text());
        const body = {
          status: request.status,
          data: response,
        };
        sendResponse(body);
      })();
    }
    return true;
  });
})();
