import { useGlobalContext } from '../context';
import Avatar from './Avatar';
import { LuLogOut } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";


const Navbar = () => {
    const { user, logout, setIsModelActive } = useGlobalContext();

    return (
        <nav className="px-8 py-3 bg-gray-100 shadow flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">
                Chat<span className="text-blue-500">Connect</span>
            </h1>
            {user && <div className='flex items-center gap-2'>
                <IoSearch className="w-5 h-5 hover:cursor-pointer hover:text-blue-500 mr-2" onClick={() => setIsModelActive(true)} />
                <LuLogOut className="w-5 h-5 hover:cursor-pointer hover:text-blue-500 mr-2" onClick={logout} />
                <Avatar name={user.name} />
            </div>}
        </nav>
    )
}

export default Navbar;
