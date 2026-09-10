import { useNewGame } from '../hooks/useNewGame.ts'
import NewGame from './NewGame.tsx'

function App() {
  return (
    <>
      <div className="app">
        <h1>AFW</h1>
        <NewGame />
      </div>
    </>
  )
}

export default App
