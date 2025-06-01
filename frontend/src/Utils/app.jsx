const apiRequestCounts = {}; 

const requestHandler = async (api, setLoading, onSuccess, onError) => {
    try {
        if (typeof api !== "function") {
            throw new Error("API function is not defined");
        }

       

        setLoading && setLoading(true);

        const response = await api();

        const { data, status } = response || {};

        // console.log(`API Response for ${apiName}: ${data.message}`, data);

        if (status >= 200 && status < 300) {
            if (data?.success) {
                onSuccess(data);
            } else {
                console.error(`Unexpected API Response for`, data);
                onError("Something went wrong with the API response");
            }
        } else {
            console.error(`API Request Failed for ${apiName}:`, response);
            onError(data?.message || `Error: ${status}`);
        }
    } catch (error) {
        let errorMessage = "Something went wrong.";
        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        onError(errorMessage);

        if (error?.response?.status === 401 || error?.response?.status === 403) {
            console.log("Unauthorized! Token might be invalid or expired.");
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
      return null; 
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