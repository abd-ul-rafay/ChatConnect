import { useState } from "react";
import { useGlobalContext } from '../context/index';
import axiosInstance from "../api";
import { toast } from 'react-toastify';
import FadeLoader from "react-spinners/FadeLoader";

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
      toast.error(err?.response?.data?.err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const registerUser = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
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
      toast.error(err?.response?.data?.err || 'Something went wrong');
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

    const fieldsCompleted = form.email && form.password && (isLogin || form.name && form.confirmPassword)

    if (!fieldsCompleted) {
      toast.error("Please fill all the fields...");
      return;
    }

    isLogin ? loginUser() : registerUser();
  }

  return (
    <section className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-2/5 mx-auto my-20 px-10 py-5 bg-white rounded shadow relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded">
          <FadeLoader
            color="#3b82f6"
            loading={true}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <form onSubmit={handleFormSubmit} className={`${loading ? 'pointer-events-none opacity-50' : ''}`}>
        <h2 className="text-2xl mb-2">{isLogin ? "Login" : "Register"}</h2>
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
          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white p-1 my-1 rounded disabled:bg-blue-300"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
        <p className="text-sm">
          {isLogin ? 'Do not have an account, ' : 'Already have an account, '}
          <span
            className={`text-blue-500 underline ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
