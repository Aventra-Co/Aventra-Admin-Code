import React from "react";
import HeaderLayout from "./HeaderLayout";
import SidebarLayout from "./SidebarLayout";
import MainLayout from "./MainLayout";
import FooterLayout from "./FooterLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PageLayout({ children }) {

    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0)}, [pathname]);

    return (
        <>
            <HeaderLayout />
            <SidebarLayout />
            <MainLayout>
                <>
                    { children }
                    {pathname !== "/message" ? <FooterLayout /> : ""}
                </>
            </MainLayout>
        </>
    )
}