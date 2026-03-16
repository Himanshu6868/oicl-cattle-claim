let activeRequests = 0;
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const incrementLoader = () => {
  activeRequests += 1;
  notifyListeners();
};

const decrementLoader = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notifyListeners();
};

export const trackApiRequest = async (requestPromise) => {
  incrementLoader();

  try {
    return await requestPromise;
  } finally {
    decrementLoader();
  }
};

export const subscribeApiLoader = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getApiLoaderSnapshot = () => activeRequests > 0;
