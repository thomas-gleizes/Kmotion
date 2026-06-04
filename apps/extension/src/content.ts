/// <reference types="chrome" />

function extractVideoId(): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  const url = window.location.href

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

// Send video ID to popup when loaded
window.addEventListener("load", () => {
  const videoId = extractVideoId()
  if (videoId) {
    chrome.runtime.sendMessage({
      type: "YOUTUBE_VIDEO_DETECTED",
      videoId,
    }).catch(() => {
      // Popup not open
    })
  }
})

// Listen for URL changes (single page app)
let lastUrl = window.location.href
new MutationObserver(() => {
  const currentUrl = window.location.href
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl
    const videoId = extractVideoId()
    chrome.runtime.sendMessage({
      type: "YOUTUBE_VIDEO_DETECTED",
      videoId,
    }).catch(() => {
      // Popup not open
    })
  }
}).observe(document.documentElement, { subtree: true, childList: true })

