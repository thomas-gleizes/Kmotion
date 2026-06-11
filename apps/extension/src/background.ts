/// <reference types="chrome" />
export {}

// NOTE: kept self-contained (no imports) so the bundled service worker stays a
// standalone file. The popup uses utils/youtube.ts.
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

function notifyVideoId(url: string | undefined) {
  if (!url) return
  chrome.runtime
    .sendMessage({ type: "VIDEO_ID_CHANGED", videoId: extractVideoId(url) })
    .catch(() => {
      // Popup not open / extension context invalidated
    })
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  notifyVideoId(tab.url)
})

chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url) notifyVideoId(changeInfo.url)
})
