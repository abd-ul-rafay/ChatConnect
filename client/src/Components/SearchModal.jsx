import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import axiosInstance from '../api';
import Profile from "./Profile";

const SearchModal = () => {
    const { token, setIsModelActive, getChat } = useGlobalContext();
    const [isActive, setIsActive] = useState(false); // for transition

    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setIsActive(true);
    }, []);

    const closeModal = () => {
        setIsModelActive(false); // clicked outside content container
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const searchUsers = async (text) => {
        try {
            const response = await axiosInstance.get(`/api/v1/user/search?name=${text}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUsers(response.data);
        } catch (err) {
            alert(err?.response?.data?.err || 'Something went wrong');
        }
    }

    useEffect(() => {
        if (searchText.length < 1) {
            setUsers([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            searchUsers(searchText);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    const handleProfileClick = (id) => {
        getChat(id, true);
        setIsModelActive(false);
    }

    return (
        <section className={`w-full h-full bg-black/40 fixed top-0 left-0 flex justify-end modal ${isActive ? 'active' : ''}`} onClick={closeModal}>
            <aside className="w-2/3 sm:w-96 p-5 h-full bg-gray-100 shadow" onClick={handleContentClick}>
                <div className="flex items-center justify-between">
                    <p className="text-lg">Search Users</p>
                    <svg className="w-5 h-5 hover:cursor-pointer hover:text-blue-500" onClick={closeModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    className="w-full bg-gray-200 border p-1 my-2 focus:outline-none rounded"
                    type="text"
                    placeholder="Enter Name"
                    name="name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="h-[80vh] overflow-y-scroll">
                    {users.map(user => (<Profile key={user._id} name={user.name} onClick={() => handleProfileClick(user._id)} />))}
                </div>
                {users.length < 1 && searchText.length > 0 && <p className="text-center mt-10 text-sm">- - - -</p>}
            </aside>
        </section>
    );
}

export default SearchModal;
