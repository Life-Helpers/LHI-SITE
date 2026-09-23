/** Browser-side memory that this visitor has subscribed to LHI news (unlocks downloads). */
const KEY = "lhi_subscriber";

export function isSubscriber() {
  try {
    return Boolean(localStorage.getItem(KEY));
  } catch {
    return false;
  }
}

export function rememberSubscriber(email: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ email, at: new Date().toISOString() }));
  } catch {
    /* storage unavailable: the visitor will simply be asked again next time */
  }
}
