import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context";
import UserCard from "../components/UserCard";
import MessageBar from "../components/MessageBar";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance, { BASE_URL } from "../api";
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { IoMdSend } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const HomePage = () => {
  const { user, token, myChats, setMyChats, getMyChats, myChatsLoading, getChat, setIsModelActive } = useGlobalContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    getMyChats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const socketIoSetup = () => {
    const newSocket = io(BASE_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.emit('join', chatData.chat._id);

    newSocket.on('receiveMessage', ({ sender, content }) => {
      addMessageToState(sender, content);
      sendToTopAndUpdate(content);
    });
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatData && !socket) {
      socketIoSetup();
    }

    scrollToBottom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData])

  const handleProfileClick = async (chatUser) => {
    if (chatData) {
      leaveRoom(chatData.chat._id); // leave previous room
    }

    setSocket(null);
    setMessageInput('');
    setChatData(null);

    setSelectedUser(chatUser);
    const data = await getChat(chatUser._id);
    setChatData(data);
  }

  const sendToTopAndUpdate = (latestMessage) => {
    if (!chatData) {
      return;
    }

    setMyChats(prev => {
      const curr = prev.find(p => p._id === chatData.chat._id);

      if (!curr.latestMessage) {
        curr.latestMessage = { content: latestMessage }
      } else {
        curr.latestMessage.content = latestMessage;
      }

      return [
        curr,
        ...prev.filter(p => p._id !== chatData.chat._id)
      ]
    });
  }

  const addMessageToState = (sender, content) => {
    setChatData(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          content,
          sender,
          createdAt: Date.now(),
          _id: Date.now()
        }
      ]
    }));
  }

  const sendMessage = (content) => {
    socket.emit('sendMessage', { chatId: chatData.chat._id, sender: user._id, content });
  }

  const saveMessage = async (content) => {
    try {
      const body = {
        chat: chatData.chat._id,
        content
      };

      await axiosInstance.post('api/v1/chats/message', JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

    } catch (err) {
      toast.error(err?.response?.data?.err || 'Something went wrong');
    }
  }

  const handleOnMessageSend = (e) => {
    e.preventDefault();

    if (!messageInput || !chatData) {
      return;
    }

    setMessageInput('');

    sendToTopAndUpdate(messageInput); // send chat to top and update latest message
    sendMessage(messageInput); // send message to other user
    addMessageToState(user._id, messageInput); // update your own state
    saveMessage(messageInput); // post message to db
  }

  const leaveRoom = (chatId) => {
    if (!socket) {
      return;
    }

    socket.emit('leaveRoom', chatId);
  }

  const handleCancelChatIcon = () => {
    if (chatData) {
      leaveRoom(chatData.chat._id);
    }

    setSelectedUser(null);
    setChatData(null);
    setSocket(null);
    setMessageInput('');
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 py-6 flex gap-4 h-[90vh]">
      {/* Left portion */}
      <div className={`w-full md:w-1/3 ${selectedUser && 'hidden md:block'} bg-white shadow-md rounded px-3 py-2 overflow-y-auto`} >
        <p className="font-semibold tracking-wide">Your Chats</p>
        {myChatsLoading && <div className="flex justify-center my-10">
          <ClipLoader
            loading={true}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>}
        {myChats.length < 1 && !myChatsLoading && <p className="text-center text-sm mt-20">
          <span className="text-blue-500 hover:cursor-pointer hover:underline" onClick={() => setIsModelActive(true)}>Search</span>
          {' users and chat with them'}</p>}
        {myChats.map(chat => chat.users.map(chatUser => {
          if (chatUser._id === user._id) {
            return;
          }

          return <UserCard key={chatUser._id} name={chatUser.name} subtitle={chat?.latestMessage?.content} onClick={() => handleProfileClick(chatUser)} isSelected={(selectedUser && selectedUser._id === chatUser._id) ? true : false} />
        }))}
      </div>

      {/* Right portion */}
      <div className={`w-full md:w-2/3 ${!selectedUser && 'hidden md:block'} bg-white shadow-md rounded py-2 flex flex-col`}>
        {selectedUser
          ? <>
            <div className="px-2 py-1 flex items-center justify-between">
              <p className="font-semibold tracking-wide">Your chats with {selectedUser.name}</p>
              <RxCross2 className="w-5 h-5 hover:cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={handleCancelChatIcon} />
            </div>
            <hr className="mx-2" />
            {chatData
              ? chatData?.messages?.length > 0
                ? <div className="p-2 flex-grow overflow-y-auto" ref={chatContainerRef}>
                  {chatData?.messages?.map(message => <MessageBar key={message._id} {...message} />)}
                </div>
                : <div className="p-2 flex flex-grow items-center justify-center" ref={chatContainerRef}>
                  <p className="text-sm text-center">Send {selectedUser.name} a message to start a conversation.</p>
                </div>
              : <div className="flex flex-grow justify-center items-center">
                <ClipLoader
                  loading={true}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>}
            <form className="px-2 pt-2 mx-2 flex gap-2" onSubmit={handleOnMessageSend}>
              <input
                className="w-full px-4 py-2 border border-gray-300 bg-transparent focus:outline-none focus:border-gray-400 text-sm rounded-full"
                type="text"
                name="message"
                placeholder="Type your message here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="submit">
                {/* <svg className="w-6 h-6 hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg> */}
                <IoMdSend className="w-6 h-6 hover:text-blue-500 transition-colors duration-200" />
              </button>
            </form>
          </>
          : <div className="h-full flex flex-col items-center justify-center">
            <p className="text-3xl font-bold tracking-wide">
              Chat<span className="text-blue-500">Connect</span>
            </p>
            <p className="text-sm">Connect with people all around the globe in realtime...</p>
          </div>
        }

      </div>
    </section>
  )
}

export default HomePage;
