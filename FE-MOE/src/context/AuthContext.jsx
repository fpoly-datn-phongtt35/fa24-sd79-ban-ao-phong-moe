// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [step, setStep] = useState(0);

  const [dataRegister, setDataRegister] = useState([]);

  const funcs = {
    step,
    setStep,
    dataRegister,
    setDataRegister,
  };
  return <AuthContext.Provider value={funcs}>{children}</AuthContext.Provider>;
};
export { AuthContext, AuthProvider };
