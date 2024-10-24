// background.js

// Polyfill for browser compatibility
if (typeof browser === "undefined") {
  var browser = chrome;
}

// Listen for web requests and capture authorization headers
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "authorization" && header.value.startsWith("Bearer")) {
        // Save the bearer token to browser storage
        browser.storage.local.set({ bearerToken: header.value }, () => {
          console.log('Bearer token saved:', header.value);
        });
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://*.libbyapp.com/*"] },
  ["requestHeaders"]
);

// Reload the active tab when the extension is first installed
browser.runtime.onInstalled.addListener(() => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      browser.tabs.reload(tabs[0].id);
    }
  });
});
