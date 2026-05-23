import '@testing-library/jest-dom';

Object.defineProperty(window, 'localStorage', {
  value: (() => {
    let store = {};
    return {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })(),
});

Object.defineProperty(window, 'sessionStorage', {
  value: (() => {
    let store = {};
    return {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })(),
});
