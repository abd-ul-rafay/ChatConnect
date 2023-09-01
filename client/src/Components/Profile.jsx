import Avatar from "./Avatar"

const Profile = ({ name, onClick, isSelected = false, subtitle = null }) => {
    return (
        <div className={`flex gap-4 items-center p-2 my-1.5 rounded hover:cursor-pointer bg-gray-200 hover:bg-gray-300 ${isSelected && 'border-[1px] border-gray-300'}`} onClick={onClick}>
            <Avatar name={name} />
            <div className="max-w-[60%]">
                <p className="text-sm truncate">{name}</p>
                {subtitle && <p className="text-xs truncate">{subtitle}</p>}
            </div>
        </div>
    )
}

export default Profile
