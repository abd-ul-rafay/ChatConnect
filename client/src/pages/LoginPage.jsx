import { useState } from "react";
import { useGlobalContext } from '../context/index';
import axiosInstance from "../api";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { setUser, setToken } = useGlobalContext();

  const loginUser = async () => {
    try {
      const response = await axiosInstance.post('api/v1/user/login', JSON.stringify(form), {
        headers: { 'Content-Type': 'application/json' }
      });

      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));
    } catch (err) {
      alert(err?.response?.data?.err || 'Something went wrong');
    }
  }

  const registerUser = async () => {
    try {
      const response = await axiosInstance.post('api/v1/user/register', JSON.stringify(form), {
        headers: { 'Content-Type': 'application/json' }
      });

      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));
    } catch (err) {
      alert(err?.response?.data?.err || 'Something went wrong');
    }
  }

  const toggleLogin = () => {
    setForm({ name: '', email: '', password: '' });
    setIsLogin(prev => !prev);
  }

  const handleInputSubmit = (e) => {
    setForm(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    });
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    return isLogin ? loginUser() : registerUser();
  }

  return (
    <section className="w-11/12 max-w-sm mx-auto my-20 p-3 rounded">
      <form onSubmit={handleFormSubmit}>
        <input
          className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleInputSubmit}
        />
        <input
          className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleInputSubmit}
        />
        {!isLogin && <input
          className="w-full bg-gray-50 border p-1 my-1 focus:outline-none rounded"
          type="text"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleInputSubmit}
        />}
        <button className="w-full bg-blue-500 text-white p-1 my-1 rounded" type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p className="text-sm">
          {isLogin ? 'Do not have an account, ' : 'Already have an account, '}
          <span
            className="text-blue-500 underline hover:cursor-pointer"
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
