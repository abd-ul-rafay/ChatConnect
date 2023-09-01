const Avatar = ({ name }) => {
    return (
        <div className="w-8 h-8 bg-blue-500 rounded-3xl flex items-center justify-center">
            <p className="text-sm text-white">{`${name[0].toUpperCase()}${name[1]}`}</p>
        </div>
    )
}

export default Avatar;
