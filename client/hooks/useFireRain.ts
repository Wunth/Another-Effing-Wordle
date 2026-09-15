import confetti from 'canvas-confetti'

// Fire emoji shape confetti will draw instead of its default squares/circles
const fireShape = confetti.shapeFromText({ text: '🔥', scalar: 2 })

export function useFireRain() {
  const triggerFireRain = () => {
    // Fires several small bursts, each slightly delayed, so the fire falls
    // staggered instead of all at once in a straight line
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 3,
          shapes: [fireShape],
          scalar: 2,
          gravity: 1,
          startVelocity: 0,
          spread: 100,
          origin: { x: Math.random(), y: 0 },
          ticks: 300,
        })
      }, i * 150) // each burst starts 150ms after the last
    }
  }

  return { triggerFireRain }
}
