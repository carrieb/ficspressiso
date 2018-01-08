let tabs = [];

chrome.tabs.query({
    url: "https://archiveofourown.org/works/*/chapters/*"
  }, (result) => {
    console.log(tabs);
    tabs = result;

    // TODO: .. *process that tab* ..
    // .. interrupt close ..
    // .. focus on tab ..
    // .. popup rater/commenter ..
    // .. save ..
  }
);

chrome.tabs.onRemoved.addListener(
  (tabId, { windowId, isWindowClosing }) => {

  }
);

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension", request);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/api/fic/feedback', true);
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        console.log(xhr.responseText);
        sendResponse({ result: xhr.responseText });
      } else {
        sendResponse({ error: xhr.responseText });
      }
    }
    xhr.send(JSON.stringify({ fic: 'asdf', feedback: 'asdf' }));
  });
