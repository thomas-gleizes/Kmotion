chrome.runtime.onInstalled.addListener(async () => {
  console.log("========= installed =========")

  // await chrome.storage.local.set({ [STORAGE_KEY.AUTH_TOKEN]: null })
})
