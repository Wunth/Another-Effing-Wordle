/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App'
import StatsPage from './components/StatsPage.tsx'

const routes = createRoutesFromElements(
  <>
    <Route index element={<App />} />
    <Route path="stats" element={<StatsPage />} />
  </>,
)

export default routes
