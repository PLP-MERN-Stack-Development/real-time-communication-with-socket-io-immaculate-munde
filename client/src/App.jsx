import { useState, useEffect, useRef } from 'react';
import { useSocket } from './socket';

function App() {
  const { isConnected, messages, connect, sendMessage, users } = useSocket();

  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleLogin = () => {
    if (username.trim()) {
      connect(username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
      setCurrentMessage("");
    }
  };

  return (
    // Main Container
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      {!isLoggedIn ? (
        // LOGIN SCREEN
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🚀 Join Chat</h1>
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your username..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
            >
              Enter Room
            </button>
          </div>
        </div>
      ) : (
        // CHAT SCREEN
        <div className="flex flex-col md:flex-row w-full max-w-6xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-slate-900 text-white flex flex-col border-r border-slate-700">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <h3 className="font-bold text-lg">Active Users</h3>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-xs text-slate-400">{users.length}</span>
              </div>
            </div>
            
            <ul className="flex-1 overflow-y-auto p-2 space-y-1">
              {users.map((u) => (
                <li key={u.id} className={`p-3 rounded-lg flex items-center gap-2 text-sm transition ${u.username === username ? "bg-slate-800 text-blue-300 font-semibold" : "hover:bg-slate-800 text-slate-300"}`}>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  {u.username} {u.username === username && '(You)'}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50 relative">
            
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col ${msg.system ? 'items-center' : (msg.sender === username ? 'items-end' : 'items-start')}`}
                >
                  {msg.system ? (
                    <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">{msg.message}</span>
                  ) : (
                    <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm ${msg.sender === username ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                      {msg.sender !== username && <p className="text-[10px] font-bold text-gray-500 mb-1">{msg.sender}</p>}
                      <p className="leading-relaxed">{msg.message}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full outline-none transition-all"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;