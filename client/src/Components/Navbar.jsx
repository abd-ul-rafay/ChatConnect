import { useGlobalContext } from '../context';
import Avatar from './Avatar';

const Navbar = () => {
    const { user, logout, setIsModelActive } = useGlobalContext();

    return (
        <nav className="px-8 py-3 bg-gray-100 shadow flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">
                Chat<span className="text-blue-500">Connect</span>
            </h1>
            {user && <div className='flex items-center gap-2'>
                <svg className="w-5 h-5 hover:cursor-pointer hover:text-blue-500" onClick={() => setIsModelActive(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
                <svg className="w-5 h-5 hover:cursor-pointer hover:text-blue-500" onClick={logout} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                </svg>
                <Avatar name={user.name} />
            </div>}
        </nav>
    )
}

export default Navbar;
