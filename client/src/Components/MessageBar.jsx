import { useGlobalContext } from "../context";

const MessageBar = ({ sender, content, createdAt }) => {
    const { user } = useGlobalContext();
    const ownMessage = sender === user._id;

    return (
        <div className={`my-1 rounded-md flex ${ownMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={
                `${ownMessage
                    ? 'bg-blue-400 rounded-tr-none rounded-br-xl rounded-l-md'
                    : 'bg-gray-300 rounded-tl-none rounded-bl-xl rounded-r-md'} 
                max-w-[60%] px-3 py-1 transition-all hover:px-3`
            }>
                <p className={`text-sm ${ownMessage && 'text-white text-right'}`}>{content}</p>
                <p className={`text-[0.7rem] ${ownMessage && 'text-white text-right'}`}>
                    {new Date(createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })}
                </p>
            </div>
        </div>
    );
}

export default MessageBar;
