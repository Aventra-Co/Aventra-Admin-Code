import React, { useContext } from "react";
import { SidebarContext } from "../context/Sidebar";

export default function MainLayout({ children }) {
    const { sidebar } = useContext(SidebarContext);
    return <main className={`mc-main ${sidebar && "active"}`}>{ children }</main>
}