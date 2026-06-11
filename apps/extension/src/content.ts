/// <reference types="chrome" />
export {}

// NOTE: kept self-contained (no imports) — MV3 content scripts are classic
// scripts and cannot use ES module `import`. The popup uses utils/youtube.ts.
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

function notify() {
  chrome.runtime
    .sendMessage({
      type: "YOUTUBE_VIDEO_DETECTED",
      videoId: extractVideoId(window.location.href),
    })
    .catch(() => {
      // Popup not open
    })
}

window.addEventListener("load", notify)

// YouTube is a single-page app: re-check on client-side navigation.
let lastUrl = window.location.href
new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href
    notify()
  }
}).observe(document.documentElement, { subtree: true, childList: true })
