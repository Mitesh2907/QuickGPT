import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ SET GLOBAL AXIOS DEFAULTS
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common["Content-Type"] = "application/json";

// ✅ CREATE PROPER AXIOS INSTANCE (for context use)
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { "Content-Type": "application/json" },
});

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);


  // Attach token automatically
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log("Fetching user data...");
      const { data } = await api.get("/api/user/data");
      console.log("User data response:", data);

      if (data.success) {
        // Only update user if server returns user data
        if (data.user) {
          setUser(data.user);
          console.log("User set from server:", data.user);
        } else {
          console.log("No user data from server, using localStorage");
        }
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast("Login to create new chat");

      const { data } = await api.get("/api/chat/create");
      if (data.success && data.chat) {
        // Add the new chat to the chats list and select it
        setChats(prev => [data.chat, ...prev]);
        setSelectedChat(data.chat);
      } else {
        // Fallback: refetch all chats
        await fetchUserChats();
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserChats = async () => {
    try {
      console.log("🔄 Fetching user chats...");
      const { data } = await api.get("/api/chat/get");
      console.log("📨 Chats response:", data);

      if (data.success) {
        console.log("✅ Setting", data.chats.length, "chats");
        setChats(data.chats);

        // Preserve currently selected chat if it still exists
        if (selectedChat) {
          const updatedSelectedChat = data.chats.find(chat => chat._id === selectedChat._id);
          if (updatedSelectedChat) {
            setSelectedChat(updatedSelectedChat);
          } else {
            // If selected chat no longer exists, select the first one
            setSelectedChat(data.chats[0] || null);
          }
        } else {
          // No chat was selected, select the first one
          setSelectedChat(data.chats[0] || null);
        }
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      // Try to load user data from localStorage first
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          setLoadingUser(false);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          fetchUser(); // Fallback to API call
        }
      } else {
        fetchUser(); // Fallback to API call
      }

      fetchUserChats(); // Also load chats when user is authenticated
    } else {
      setUser(null);
      setChats([]); // Clear chats when not authenticated
      setSelectedChat(null);
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    createNewChat,
    loadingUser,
    fetchUserChats,
    token,
    setToken,
    axios: api,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
