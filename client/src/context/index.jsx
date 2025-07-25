import { createContext, useContext, useState } from 'react';
import axiosInstance from '../api';
import { toast } from 'react-toastify';

const GlobalContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => useContext(GlobalContext);

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));
    const [myChats, setMyChats] = useState([]);
    const [myChatsLoading, setMyChatsLoading] = useState(true);
    const [isModelActive, setIsModelActive] = useState(false);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        setMyChats([]);
        setIsModelActive(false);
    }

    const getChat = async (id, isFromSearch = false) => {
        try {
            const response = await axiosInstance.get(`/api/v1/chats/with/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
 
            if (isFromSearch) {
                getMyChats(); // if new chat is started, update myChats
            }

            return response.data;
        } catch (err) {
            toast.error(err?.response?.data?.err || 'Something went wrong');
        }
    }

    const getMyChats = async () => {
        try {
            setMyChatsLoading(true);
            const response = await axiosInstance.get('/api/v1/chats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMyChats(response.data); 
        } catch (err) {
            toast.error(err?.response?.data?.err || 'Something went wrong');
        }

        setMyChatsLoading(false);
    }

    return (
        <GlobalContext.Provider
            value={{ user, setUser, token, setToken, logout, isModelActive, setIsModelActive, getChat, getMyChats, myChats, setMyChats, myChatsLoading }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default AppProvider;
