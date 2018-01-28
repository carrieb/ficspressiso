// let tabs = [];
//
// chrome.tabs.query({
//     url: "https://archiveofourown.org/works/*/chapters/*"
//   }, (result) => {
//     console.log(tabs);
//     tabs = result;
//
//     // TODO: .. *process that tab* ..
//     // .. interrupt close ..
//     // .. focus on tab ..
//     // .. popup rater/commenter ..
//     // .. save ..
//   }
// );
//
// chrome.tabs.onRemoved.addListener(
//   (tabId, { windowId, isWindowClosing }) => {
//
//   }
// );


// TODO: build in individual tab info around crawling
let isCrawling = false;
let crawlPage = 1;

function submitFeedback(request, sender, sendResponse) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/api/fic/feedback', true);

  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      console.log(xhr.responseText);
      sendResponse({ result: xhr.responseText });
    } else if (this.status !== 200) {
      sendResponse({ error: xhr.responseText });
    }
  }

  xhr.send(
    JSON.stringify({
      fic: request.fic,
      feedback: request.feedback
    })
  );
}

function submitFics(request, sender, sendResponse) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', 'http://localhost:3000/api/fic', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const fics = JSON.parse(xhr.responseText);
      const result = {
        fics,
        isCrawling,
        crawlPage
      }
      sendResponse({ result });
    } else if (this.status !== 200) {
      sendResponse({ error: xhr.responseText });
    }
  }

  xhr.send(
    JSON.stringify({
      fics: request.fics
    })
  );
}

function submitFic(request, sender, sendResponse) {
  submitFics({ fics: [request.fic] }, sender, sendResponse);
}

function lookupFic(request, sender, sendResponse) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/api/find/fic', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      console.log(xhr.responseText);
      sendResponse({ result: xhr.responseText !== "" ? JSON.parse(xhr.responseText) : null });
    } else if (this.status !== 200) {
      sendResponse({ error: xhr.responseText });
    }
  }

  xhr.send(
    JSON.stringify({
      q: {
        ao3_id: request.id
      }
    })
  );
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension", request);

    switch(request.messageType) {
      case 'SUBMIT_FEEDBACK':
        submitFeedback(request, sender, sendResponse);
        break;
      case 'LOOKUP_FIC':
        lookupFic(request, sender, sendResponse);
        break;
      case 'SUBMIT_FIC':
        submitFic(request, sender, sendResponse);
        break;
      case 'UPLOAD_AO3_CRAWL':
        if (isCrawling) {
          crawlPage += 1
        }
        submitFics(request, sender, sendResponse);
        break;
      case 'AOE_CRAWL_START':
        // TODO: store the crawl somehow
        isCrawling = true;
        break;
    }

    return true;
  });
