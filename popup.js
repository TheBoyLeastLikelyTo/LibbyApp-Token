// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const tokenInput = document.getElementById('token');
  const messageDiv = document.getElementById('message');
  const buttonContainer = document.getElementById('container-info');
  const containerHidden = 'none';
  const containerShown = 'block';
  const emptyToken = '';
  const reloadTimer = 1000; // Increase for slower connections

  // Polyfill for browser compatibility
  if (typeof browser === "undefined") {
    var browser = chrome;
  }

  // Change the button hidden/shown state
  function containerChangeButtonState(show) {
    if (show === false) {
      buttonContainer.style.display = containerHidden; // Hide buttons
    } else {
      buttonContainer.style.display = containerShown; // Show buttons
    }
  }

  // Function to display error messages
  function showMessage(message, type) {
    if (type === 'error') {
      messageDiv.style.color = 'red';
    } else {
      messageDiv.style.color = 'black';
    }

    tokenInput.value = emptyToken;
    messageDiv.textContent = message;
  }

  // Function to show the token
  function showToken(data) {
    if (data.bearerToken) {
      tokenInput.value = data.bearerToken;
      messageDiv.textContent = emptyToken;
      containerChangeButtonState(true);
    } else {
      showMessage("No token found. Please sign in and try refreshing.", "error");
      containerChangeButtonState(false);
    }
  }

  // Refresh the token when the button is clicked
  document.getElementById('refresh').addEventListener('click', () => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      browser.tabs.reload(tabs[0].id);
      showMessage("Refreshing Token!");
      setTimeout(() => {
        browser.storage.local.get('bearerToken').then(showToken);
      }, reloadTimer); // wait for the reload to complete
    });
  });

  // Select all text in the text box when the "Select All" button is clicked
  document.getElementById('select').addEventListener('click', () => {
    tokenInput.select();
  });

  // Copy the text in the text box to the clipboard when the "Copy to Clipboard" button is clicked
  document.getElementById('copy').addEventListener('click', () => {
    navigator.clipboard.writeText(tokenInput.value).then(() => {
      showMessage('Token copied to clipboard');
    }).catch((err) => {
      showMessage('Token could not be copied', 'error');
      console.error('Could not copy text: ', err);
    });
  });

});
