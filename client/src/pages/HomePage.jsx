import { useEffect, useRef, useState } from "react";
import Profile from "../Components/Profile";
import { useGlobalContext } from "../context";
import ClipLoader from "react-spinners/ClipLoader";
import MessageBar from "../Components/MessageBar";
import axiosInstance, { BASE_URL } from "../api";
import io from 'socket.io-client';

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
    const newSocket = io(BASE_URL);
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

      await axiosInstance.post('api/v1/chat/send-message', JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

    } catch (err) {
      alert(err?.response?.data?.err || 'Something went wrong');
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
    <section className="p-4 flex gap-4 h-[90vh]">
      {/* Left portion */}
      <div className={`w-full md:w-1/3 ${selectedUser && 'hidden md:block'} bg-gray-100 shadow-md rounded px-3 py-2 overflow-y-auto`} >
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

          return <Profile key={chatUser._id} name={chatUser.name} subtitle={chat?.latestMessage?.content} onClick={() => handleProfileClick(chatUser)} isSelected={(selectedUser && selectedUser._id === chatUser._id) ? true : false} />
        }))}
      </div>

      {/* Right portion */}
      <div className={`w-full md:w-2/3 ${!selectedUser && 'hidden md:block'} bg-gray-100 shadow-md rounded py-2 flex flex-col`}>
        {selectedUser
          ? <>
            <div className="px-2 py-1 flex items-center justify-between">
              <p className="font-semibold tracking-wide">Your chats with {selectedUser.name}</p>
              <svg className="w-5 h-5 hover:cursor-pointer hover:text-blue-500" onClick={handleCancelChatIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <hr className="mx-2" />
            {chatData
              ? <div className="p-2 flex-grow overflow-y-auto" ref={chatContainerRef}>
                {
                  chatData?.messages?.length > 0
                    ? chatData?.messages?.map(message => <MessageBar key={message._id} {...message} />)
                    : <p className="text-sm text-center my-5">Send {selectedUser.name} a message to start a conversation.</p>
                }
              </div>
              : <div className="flex-grow flex justify-center items-center">
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
              <button type="submit" className="">
                <svg className="w-6 h-6 hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>
          </>
          : <div className="h-full flex items-center justify-center"><p className="text-sm">Your chats with others will shown here</p></div>
        }

      </div>
    </section>
  )
}

export default HomePage;
