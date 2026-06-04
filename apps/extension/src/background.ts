/// <reference types="chrome" />

// Listener for tab changes to send the current video ID
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  if (tab.url) {
    const videoId = extractVideoId(tab.url)
    chrome.runtime.sendMessage({
      type: "VIDEO_ID_CHANGED",
      videoId,
    }).catch(() => {
      // Extension context invalidated
    })
  }
})

// Listener for URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const videoId = extractVideoId(changeInfo.url)
    chrome.runtime.sendMessage({
      type: "VIDEO_ID_CHANGED",
      videoId,
    }).catch(() => {
      // Extension context invalidated
    })
  }
})

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

