// hooks/useConfettiRain.ts
import confetti from 'canvas-confetti'

export function useConfettiRain() {
  const triggerConfettiRain = () => {
    // Step 1: Set how long the confetti will fall (3 seconds)
    const duration = 3 * 1000

    // Step 2: Figure out the exact time when it should stop
    const animationEnd = Date.now() + duration

    // Step 3: Pick basic settings like speed and spread
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    // Step 4: Start a repeating timer
    const interval = setInterval(() => {
      // Step 5: Check how much time is left
      const timeLeft = animationEnd - Date.now()

      // Step 7: Stop the timer when time is up
      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Step 6: Shoot a burst of confetti from a random spot at the top
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: 0 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: 0 },
      })
    }, 250)
  }

  return { triggerConfettiRain }
}
