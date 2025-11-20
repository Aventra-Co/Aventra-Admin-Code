import React, { useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TranslatorContext } from "../context/Translator";
import { SidebarContext } from "../context/Sidebar";
import sidenavs from "../assets/data/sidenavs.json";
import { APP_PREFIX_PATH } from "../constant/constant";

// Icons
import AddHomeWorkRoundedIcon from '@mui/icons-material/AddHomeWorkRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CellTowerIcon from '@mui/icons-material/CellTower';
import EventIcon from '@mui/icons-material/Event';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddCardIcon from '@mui/icons-material/AddCard';
import DifferenceIcon from '@mui/icons-material/Difference';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReviewsIcon from '@mui/icons-material/Reviews';
import DiscountIcon from '@mui/icons-material/Discount';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import SurfingIcon from '@mui/icons-material/Surfing';
import CopyrightIcon from '@mui/icons-material/Copyright';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

export default function SidebarLayout() {
    const { t, n, currentLanguage } = useContext(TranslatorContext);
    const { sidebar } = useContext(SidebarContext);
    const location = useLocation();
    const currentPath = location.pathname;

    const dropdownRefs = useRef([]);

    const iconMap = {
        AddHomeWorkRoundedIcon,
        AccountCircle: AccountCircleIcon,
        DashboardIcon,
        GroupIcon,
        GroupAddIcon,
        FormatListBulletedIcon,
        EditCalendarIcon,
        AccountBalanceWalletIcon,
        AssignmentIcon,
        CellTowerIcon,
        EventIcon,
        LibraryBooksIcon,
        EqualizerIcon,
        AddCardIcon,
        DifferenceIcon,
        PermPhoneMsgIcon,
        AccountBalanceIcon,
        PublicIcon,
        GroupsIcon,
        ApartmentIcon,
        ContactSupportIcon,
        CompareArrowsIcon,
        ReviewsIcon,
        DiscountIcon,
        DirectionsBoatIcon,
        AddLocationAltIcon,
        FastfoodIcon,
        LunchDiningIcon,
        HomeRepairServiceIcon,
        SurfingIcon,
        CopyrightIcon,
        FactCheckIcon,
        DataSaverOnIcon,
        ControlPointDuplicateIcon,
        SpeakerNotesIcon,
        AddLocationIcon
    };

    const handleDropdown = (event) => {
        const buttonElement = event.currentTarget;
        const itemElement = buttonElement.parentElement;
        const isActive = itemElement.classList.contains('active');
        const allItems = document.querySelectorAll('.mc-sidebar-menu-item');
        const allDropdowns = document.querySelectorAll('.mc-sidebar-dropdown-list');

        if (isActive) {
            itemElement.classList.remove('active');
            itemElement.querySelector('.mc-sidebar-dropdown-list').style.height = "0px";
        } else {
            allItems.forEach(item => item.classList.remove('active'));
            allDropdowns.forEach(dropdown => dropdown.style.height = "0px");

            itemElement.classList.add('active');
            const dropdown = itemElement.querySelector('.mc-sidebar-dropdown-list');
            dropdown.style.height = dropdown.scrollHeight + "px";
        }
    };

    useEffect(() => {
        sidenavs.forEach((sidenav) => {
            sidenav.menus.forEach((menu, menuIndex) => {
                const isSubmenuActive = menu.submenus?.some(
                    submenu => `${APP_PREFIX_PATH}${submenu.path}` === currentPath
                );
                if (isSubmenuActive && dropdownRefs.current[menuIndex]) {
                    dropdownRefs.current[menuIndex].style.height =
                        dropdownRefs.current[menuIndex].scrollHeight + "px";
                }
            });
        });
    }, [currentPath]);

    return (
        <aside className={`mc-sidebar thin-scrolling ${sidebar && "active"}`}>
            {sidenavs?.map((sidenav, sidenavIndex) => (
                <menu key={sidenavIndex} className="mc-sidebar-menu">
                    <h5 className="mc-sidebar-menu-title">{t(sidenav.title)}</h5>
                    <ul className="mc-sidebar-menu-list">
                        {sidenav.menus.map((menu, menuIndex) => {
                            const IconComponent = iconMap[menu.icon];
                            const isMenuActive = menu.path && `${APP_PREFIX_PATH}${menu.path}` === currentPath;
                            const isSubmenuActive = menu.submenus?.some(
                                submenu => `${APP_PREFIX_PATH}${submenu.path}` === currentPath
                            );

                            return (
                                <li
                                    key={menuIndex}
                                    className={`mc-sidebar-menu-item ${isMenuActive || isSubmenuActive ? "active" : ""}`}
                                >
                                    {menu.submenus ? (
                                        <>
                                            <button
                                                type="button"
                                                className={`mc-sidebar-menu-btn ${isSubmenuActive ? "active" : ""}`}
                                                onClick={handleDropdown}
                                            >
                                                {IconComponent && <IconComponent />}
                                                <span>{t(menu.text)}</span>
                                                {menu.badge?.text && (
                                                    <sup className={menu.badge.variant}>
                                                        {t(menu.badge.text)}
                                                    </sup>
                                                )}
                                                {menu.badge?.count && (
                                                    <sup className={menu.badge.variant}>
                                                        {n(menu.badge.count)}
                                                    </sup>
                                                )}
                                                {currentLanguage?.dir === "ltr" ? (
                                                    <small className="material-icons right">chevron_right</small>
                                                ) : (
                                                    <small className="material-icons left">chevron_left</small>
                                                )}
                                            </button>

                                            <ul
                                                className="mc-sidebar-dropdown-list"
                                                ref={el => dropdownRefs.current[menuIndex] = el}
                                                style={{ height: isSubmenuActive ? "auto" : "0px", overflow: "hidden", transition: "height 0.3s ease" }}
                                            >
                                                {menu.submenus.map((submenu, subIndex) => {
                                                    const isSubActive = `${APP_PREFIX_PATH}${submenu.path}` === currentPath;
                                                    return (
                                                        <li
                                                            key={subIndex}
                                                            className={`mc-sidebar-dropdown-item ${isSubActive ? "active" : ""}`}
                                                        >
                                                            <Link
                                                                to={`${APP_PREFIX_PATH}${submenu.path}`}
                                                                className={`mc-sidebar-dropdown-link ${isSubActive ? "active" : ""}`}
                                                                // 👇 Fix: prevents scroll on navigation
                                                                replace
                                                            >
                                                                {t(submenu.text)}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </>
                                    ) : (
                                        <Link
                                            to={`${APP_PREFIX_PATH}${menu.path}`}
                                            className={`mc-sidebar-menu-btn ${isMenuActive ? "active" : ""}`}
                                            // 👇 Fix: prevents scroll on navigation
                                            replace
                                        >
                                            {IconComponent && <IconComponent />}
                                            <span>{t(menu.text)}</span>
                                            {menu.badge?.count && (
                                                <sup className={menu.badge.variant}>
                                                    {n(menu.badge.count)}
                                                </sup>
                                            )}
                                            {menu.badge?.text && (
                                                <sup className={menu.badge.variant}>
                                                    {t(menu.badge.text)}
                                                </sup>
                                            )}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </menu>
            ))}
        </aside>
    );
}
