// background.js

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "authorization" && header.value.startsWith("Bearer")) {
        // Save the bearer token to chrome storage
        chrome.storage.local.set({ bearerToken: header.value }, () => {
          console.log('Bearer token saved:', header.value);
        });
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://*.libbyapp.com/*"] },
  ["requestHeaders"]
);

// Reload the page when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.reload(tabs[0].id);
  });
});
