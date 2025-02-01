document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-btn");
  const copyButton = document.getElementById("copy-btn");

  sendButton.addEventListener("click", async () => {
    const markdown = await fetchTodayHistory();
    sendToObsidian(markdown);
  });

  copyButton.addEventListener("click", async () => {
    const markdown = await fetchTodayHistory();
    await copyToClipboard(markdown);
  });
});

function fetchTodayHistory() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "getTodayHistory" }, (response) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (!response) {
        return reject("No response from background.");
      }
      if (response.success) {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  });
}

function sendToObsidian(content){
  const url = "obsidian://daily?append=true&content=" + encodeURIComponent(content);
  window.open(url);
}

async function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
