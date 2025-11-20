import { createContext, useState } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const mediaQuery = window.matchMedia("(max-width: 991px)");
    const [sidebar, setSidebar] = useState(mediaQuery.matches ? false : true);
    const toggleSidebar = () => setSidebar(!sidebar);

    return (
        <SidebarContext.Provider value={{ sidebar, toggleSidebar }}>
            { children }
        </SidebarContext.Provider>
    )
}