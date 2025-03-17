const apiRequestCounts = {}; 

const requestHandler = async (api, setLoading, onSuccess, onError, apiName = api.name || api) => {
    try {
        if (typeof api !== "function") {
            throw new Error("API function is not defined");
        }

        // Initialize or increment the count for this API
        apiRequestCounts[apiName] = (apiRequestCounts[apiName] || 0) + 1;

        setLoading && setLoading(true);
        console.log(`Sending API request for: ${apiName} | Total Requests: ${apiRequestCounts[apiName]}`);

        const response = await api();

        const { data, status } = response || {};

        console.log(`API Response for ${apiName}: ${data.message}`, data);

        if (status >= 200 && status < 300) {
            if (data?.success) {
                onSuccess(data);
            } else {
                console.error(`Unexpected API Response for ${apiName}:`, data);
                onError("Something went wrong with the API response");
            }
        } else {
            console.error(`API Request Failed for ${apiName}:`, response);
            onError(data?.message || `Error: ${status}`);
        }
    } catch (error) {
        console.error(`API Error for ${apiName}:`, error);

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