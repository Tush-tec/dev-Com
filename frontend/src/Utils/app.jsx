const isBrowser = typeof window !== "undefined"; // Move this outside the class

const requestHandler = async (api, setLoading, onSuccess, onError) => {
  try {
    if (typeof api !== 'function') {
      throw new Error('API function is not defined');
    }

    setLoading && setLoading(true);
    console.log("Sending API request...");

    const { data } = await api();
    console.log("API Response:", data);

    if (data?.success) {
      onSuccess(data);
    } else {
      console.error("Unexpected API Response:", data);
      onError('Something went wrong with the API response');
    }
  } catch (error) {
    console.error("API Error:", error);

    let errorMessage = 'Something went wrong.';
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    onError(errorMessage);
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
    }
  } finally {
    setLoading && setLoading(false);
  }
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
  LocalStorage,
};