import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const type = localStorage.getItem("type");
    const token = localStorage.getItem("token");

    if (id && type) {
      setUser({ id, type, token });
    }

    setLoading(false); // IMPORTANT
  }, []);

  const login = (userObj) => {
    localStorage.setItem("userId", userObj.id);
    localStorage.setItem("type", userObj.type);
    localStorage.setItem("token", userObj.token);

    setUser(userObj);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
