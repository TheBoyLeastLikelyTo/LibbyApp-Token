// popup.js

document.addEventListener('DOMContentLoaded', function () {
  // Function to display error messages
  function showError(message) {
    document.getElementById('token').textContent = '';
    document.getElementById('error').textContent = message;
  }

  // Check if the user is on libbyapp.com
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab.url.includes("libbyapp.com")) {
      showError("Please open libbyapp.com to use this extension.");
    } else {
      // Display the bearer token
      chrome.storage.local.get('bearerToken', (data) => {
        if (data.bearerToken) {
          document.getElementById('token').textContent = data.bearerToken;
          document.getElementById('error').textContent = '';
        } else {
          showError("No token found. Please sign in and try refreshing.");
        }
      });
    }
  });

  // Refresh the token when the button is clicked
  document.getElementById('refresh').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
      setTimeout(() => {
        chrome.storage.local.get('bearerToken', (data) => {
          if (data.bearerToken) {
            document.getElementById('token').textContent = data.bearerToken;
            document.getElementById('error').textContent = '';
          } else {
            showError("No token found. Please sign in and try refreshing.");
          }
        });
      }, 2000); // wait for the reload to complete
    });
  });
});
