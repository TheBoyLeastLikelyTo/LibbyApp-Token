// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const tokenInput = document.getElementById('token');
  const errorDiv = document.getElementById('error');

  // Function to display error messages
  function showError(message) {
    tokenInput.value = '';
    errorDiv.textContent = message;
  }

  // Check if the user is on libbyapp.com
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab.url.includes("libbyapp.com")) {
      showError("Please open libbyapp.com to use this extension.");
    } else {
      // Display the bearer token in the text box
      chrome.storage.local.get('bearerToken', (data) => {
        if (data.bearerToken) {
          tokenInput.value = data.bearerToken;
          errorDiv.textContent = '';
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
            tokenInput.value = data.bearerToken;
            errorDiv.textContent = '';
          } else {
            showError("No token found. Please sign in and try refreshing.");
          }
        });
      }, 2000); // wait for the reload to complete
    });
  });

  // Select all text in the text box when the "Select All" button is clicked
  document.getElementById('select').addEventListener('click', () => {
    tokenInput.select();
  });

  // Copy the text in the text box to the clipboard when the "Copy to Clipboard" button is clicked
  document.getElementById('copy').addEventListener('click', () => {
    tokenInput.select();
    document.execCommand('copy');
    alert('Bearer token copied to clipboard!');
  });
});
