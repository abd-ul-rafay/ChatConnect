import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { useGlobalContext } from './context';
import SearchModal from './Components/SearchModal';

const App = () => {
  const { user, isModelActive } = useGlobalContext();

  return (
    <main>
      <Navbar />
      {isModelActive && <SearchModal />}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={user ? <HomePage /> : <Navigate to={'/login'} />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path='*' element={user ? <NotFoundPage /> : <Navigate to={'/login'} />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
