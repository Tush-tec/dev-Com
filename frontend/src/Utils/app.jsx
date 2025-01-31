const isBrowser = typeof window !== "undefined"; // Move this outside the class

const requestHandler = async (api, setLoading, onSuccess, onError) => {
  try {

    if (typeof api !== 'function') {
      throw new Error('API function is not defined');
    }

    setLoading && setLoading(true);

    const { data } = await api();

    if (data?.success) {
      onSuccess(data);
    } else {
      onError('Something went wrong with the API response');
    }
  } catch (error) {
    let errorMessage = 'Something went wrong.';

    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    onError(errorMessage);


    console.error('API Error:', error);

    if (error?.response?.data?.statusCode && [401, 403].includes(error.response.data.statusCode)) {
      localStorage.clear();


      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
  } finally {
    setLoading && setLoading(false);
  }
};



const getMetaDataOfChatObject = (chat, loggedinUser) => {
  const { lastMessage, participants,  isGroupChat, name } = chat; // Destructuring

  // Generate last message content
  const lastMessageContent = lastMessage?.content
    ? lastMessage.content
    : lastMessage?.attachments?.length
    ? `${lastMessage.attachments.length} attachment${lastMessage.attachments.length > 1 ? 's' : ''}`
    : "No message yet";

  if (isGroupChat) {
    // Group Chat Metadata
    return {
      avatar: "https://via.placeholder.com/100x100.png", // Placeholder avatar
      title: name,
      description: `${participants.length} members`,
      lastMessage: `${lastMessage?.sender?.username || 'Unknown'}: ${lastMessageContent}`,
    };
  }

  // Individual Chat Metadata
  const participant = participants.find(p => p._id !== loggedinUser?._id);
  return {
    avatar: participant?.avatar?.url,
    title: participant?.username,
    description: participant?.email,
    lastMessage: lastMessageContent,
  };
};

const classNames = (...classNames) => {
  return classNames.filter(Boolean).join(" "); // Clean and concise class names generator
};

class LocalStorage {
  static isBrowser = typeof window !== "undefined";

  static get(key) {
    if (!LocalStorage.isBrowser) return null;
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null; // Return null if JSON parsing fails
    }
  }

  static set(key, value) {
    if (LocalStorage.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static remove(key) {
    if (LocalStorage.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  static clear() {
    if (LocalStorage.isBrowser) {
      localStorage.clear();
    }
  }
}

export {
  requestHandler,
  getMetaDataOfChatObject,
  classNames,
  LocalStorage,
  isBrowser, // Exported for use in other parts of your code
};