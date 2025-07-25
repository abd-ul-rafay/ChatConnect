import { useState } from "react";
import { useGlobalContext } from '../context/index';
import axiosInstance from "../api";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { setUser, setToken } = useGlobalContext();

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('api/v1/auth/login', JSON.stringify(form), {
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));
    } catch (err) {
      alert(err?.response?.data?.err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const registerUser = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('api/v1/auth/register', JSON.stringify(form), {
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));
    } catch (err) {
      alert(err?.response?.data?.err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const toggleLogin = () => {
    if (loading) return;
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
    setIsLogin(prev => !prev);
  }

  const handleInputSubmit = (e) => {
    if (loading) return;
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    isLogin ? loginUser() : registerUser();
  }

  return (
    <section className="w-11/12 max-w-sm mx-auto my-20 p-3 rounded relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded">
          <div className="text-blue-500 font-semibold animate-pulse">Processing...</div>
        </div>
      )}
      <form onSubmit={handleFormSubmit} className={`${loading ? 'pointer-events-none opacity-50' : ''}`}>
        {!isLogin && (
          <input
            className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
            type="text"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleInputSubmit}
            disabled={loading}
          />
        )}
        <input
          className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleInputSubmit}
          disabled={loading}
        />
        <input
          className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleInputSubmit}
          disabled={loading}
        />
        {!isLogin && (
          <input
            className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleInputSubmit}
            disabled={loading}
          />
        )}
        <button
          className="w-full bg-blue-500 text-white p-1 my-1 rounded disabled:bg-blue-300"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
        <p className="text-sm">
          {isLogin ? 'Do not have an account, ' : 'Already have an account, '}
          <span
            className={`text-blue-500 underline ${loading ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}`}
            onClick={toggleLogin}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </form>
    </section>
  )
}

export default LoginPage;
