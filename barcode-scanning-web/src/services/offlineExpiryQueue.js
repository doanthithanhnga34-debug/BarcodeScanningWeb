

const OFFLINE_EXPIRY_KEY = "offline_expiry_key";
export function getOfflineExpiryQueue() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_EXPIRY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function addOfflineExpiryQueue(payload) {
  const queue = getOfflineExpiryQueue();
  const item = {
    id: crypto.randomUUID(),
    payload,
    createAt: new Date().toISOString,
    status: "pending",
  };

  queue.push(item);
  localStorage.setItem(OFFLINE_EXPIRY_KEY, JSON.stringify(queue));
  return item;
}

export function removeOfflineExpiry(id) {
  const queue = getOfflineExpiryQueue().filter((item) => item.id !== id);
  localStorage.setItem(OFFLINE_EXPIRY_KEY, JSON.stringify(queue));
}

export function clearOfflineExpiryQueue(){
    localStorage.removeItem(OFFLINE_EXPIRY_KEY)
}
