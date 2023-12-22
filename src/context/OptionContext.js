import { createContext, useState } from "react";

const OptionContext = createContext();

export const OptionProvider = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [option, setOption] = useState("");
    const [input, setInput] = useState("");

    return <OptionContext.Provider value={{ input, setInput, selectedOption, setSelectedOption, option, setOption }}>{children}</OptionContext.Provider>;
};

export default OptionContext;
