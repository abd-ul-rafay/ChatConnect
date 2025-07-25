import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { useGlobalContext } from './context';
import SearchModal from './Components/SearchModal';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { user, isModelActive } = useGlobalContext();

  return (
    <main>
      <Header />
      {isModelActive && <SearchModal />}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={user ? <HomePage /> : <Navigate to={'/login'} />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path='*' element={user ? <NotFoundPage /> : <Navigate to={'/login'} />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick
      />
    </main>
  );
}

export default App;
