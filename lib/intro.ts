export const INTRO_SEEN_KEY = 'urban-bites-intro-seen'
export const INTRO_DONE_EVENT = 'urban-bites:intro-done'

export function hasSeenIntro() {
  return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
}

export function markIntroDone() {
  window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
  window.dispatchEvent(new Event(INTRO_DONE_EVENT))
}
