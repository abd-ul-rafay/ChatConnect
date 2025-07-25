import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import axiosInstance from '../api';
import Profile from "./Profile";
import { toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";

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
            const response = await axiosInstance.get(`/api/v1/users/?name=${text}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUsers(response.data);
        } catch (err) {
            toast.error(err?.response?.data?.err || 'Something went wrong');
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
            <aside className="w-2/3 sm:w-96 p-5 h-full bg-white shadow" onClick={handleContentClick}>
                <div className="flex items-center justify-between">
                    <p className="text-lg">Search Users</p>
                    <RxCross2 className="w-5 h-5 hover:cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={closeModal} />
                </div>
                <input
                    className="w-full bg-gray-100 border p-1 my-2 focus:outline-none rounded"
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
