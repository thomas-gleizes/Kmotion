/**
 * Playback position (seconds) of the video in the active tab, read by the
 * content script. `null` when it can't be reached (e.g. the tab was opened
 * before the extension was installed and has no content script yet).
 */
export async function getCurrentVideoTime(): Promise<number | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id === undefined) return null
  try {
    const response = (await chrome.tabs.sendMessage(tab.id, { type: "GET_CURRENT_TIME" })) as
      { time: number | null } | undefined
    return response?.time ?? null
  } catch {
    return null
  }
}
