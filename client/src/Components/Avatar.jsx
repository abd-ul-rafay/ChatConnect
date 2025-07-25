const Avatar = ({ name }) => {
    return (
        <div className="w-8 h-8 bg-blue-500 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-blue-600">
            <p className="text-sm font-semibold text-white">{`${name[0].toUpperCase()}`}</p>
        </div>
    )
}

export default Avatar;
