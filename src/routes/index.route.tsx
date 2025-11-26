
import Onboarding from '@/features/onboarding/Onboarding'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/onboarding' element={<Onboarding/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes