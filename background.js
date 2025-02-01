chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTodayHistory") {
    try {
      getTodayHistory().then(historyItems => {
        sendResponse({ success: true, data: historyItems });
      })
    } catch (err) {
      console.error("Failed to get history", err);
      sendResponse({ success: false, error: err.toString() });
    }
    return true; 
  }
});

async function getTodayHistory() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const startTime = startOfDay.getTime();
  const maxResults = 10000;

  return new Promise((resolve, reject) => {
    chrome.history.search(
      {
        text: "",
        startTime: startTime,
        endTime: now.getTime(),
        maxResults: maxResults,
      },
      (results) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        const markdown = buildMarkdown(results)
        resolve(markdown);
      }
    );
  });
}


function buildMarkdown(historyItems) {
  const lines = [];
  lines.push("## Today's Chrome History\n");
  historyItems.sort((a, b) => a.lastVisitTime - b.lastVisitTime);

  historyItems.forEach((item) => {
    const timeString = new Date(item.lastVisitTime).toLocaleTimeString();
    const title = item.title ? item.title.replace(/\n/g, " ") : "(No Title)";
    lines.push(`- **${timeString}** [${title}](${item.url})`);
  });

  return lines.join("\n");
}
