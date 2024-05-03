const isDev = process.env.NODE_ENV === "development";

export async function getCurrentUrl() {
  if (isDev) {
    return location.href;
  }

  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tabs.length === 0) {
    return "";
  }
  return tabs[0].url;
}

export async function readStorage<T>(key: string): Promise<T | null> {
  if (isDev) {
    const json = localStorage.getItem(key);
    if (!json) {
      return null;
    }
    return JSON.parse(json);
  }

  const value = await chrome.storage.local.get(key);
  return value[key];
}
export async function writeStorage<T>(key: string, data: T) {
  if (isDev) {
    localStorage.setItem(key, JSON.stringify(data));
    return;
  }
  await chrome.storage.local.set({
    [key]: data,
  });
}
