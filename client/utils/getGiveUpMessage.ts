// Random flavor messages shown when the player gives up
const giveUpMessages = [
  'Wow. Even a coin flip has better odds than you.',
  'Giving up already? Bold strategy.',
  'Your brain just filed for early retirement.',
  'That was rough to watch, not gonna lie.',
  'Somewhere, a dictionary is laughing at you.',
  "Think even Kam could do better than you, and she's not the smartest pea in the pod!",
]

// Picks one at random each time it's called
export function getRandomGiveUpMessage(): string {
  const index = Math.floor(Math.random() * giveUpMessages.length)
  return giveUpMessages[index]
}
