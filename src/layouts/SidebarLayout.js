import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

export default function SidebarLayout() {
    const { t, n, currentLanguage } = useContext(TranslatorContext);
    const { sidebar } = useContext(SidebarContext);
    const location = useLocation();
    const { pathname, search } = location;
    const currentPath = pathname;
    const [manualOpenMenuId, setManualOpenMenuId] = useState(null);
    const [activeGroupManuallyClosed, setActiveGroupManuallyClosed] = useState(false);
    const sidebarRef = useRef(null);
    const SIDEBAR_SCROLL_STORAGE_KEY = "mc-sidebar-scroll-top";

    const saveSidebarScrollPosition = useCallback(() => {
        if (!sidebarRef.current) return;
        sessionStorage.setItem(SIDEBAR_SCROLL_STORAGE_KEY, String(sidebarRef.current.scrollTop));
    }, [SIDEBAR_SCROLL_STORAGE_KEY]);

    useLayoutEffect(() => {
        if (!sidebarRef.current) return;

        const savedScrollTop = Number(sessionStorage.getItem(SIDEBAR_SCROLL_STORAGE_KEY));
        if (!Number.isFinite(savedScrollTop)) return;

        sidebarRef.current.scrollTop = savedScrollTop;

        // Re-apply after paint in case menu expansion/collapse changes layout height.
        const rafId = window.requestAnimationFrame(() => {
            if (!sidebarRef.current) return;
            sidebarRef.current.scrollTop = savedScrollTop;
        });

        return () => window.cancelAnimationFrame(rafId);
    }, [SIDEBAR_SCROLL_STORAGE_KEY, currentPath]);

    useEffect(() => {
        return () => {
            saveSidebarScrollPosition();
        };
    }, [saveSidebarScrollPosition]);

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
        AddLocationIcon,
        VisibilityIcon,
        EditIcon,
    };

    // Map "detail" pages (View/Add/Edit) back to their list pages in the sidebar.
    // This keeps the correct sidebar item highlighted and its parent group open.
    const pathAliases = useMemo(
        () => ({
            "/manage-users": ["/user-profile/:user_id"],
            "/deleted-users": ["/user-profile/:user_id"],

            "/manage-owners": [
                "/add-owner",
                "/edit-owner/:user_id",
                "/owner-view/:user_id",
                "/add-boat/:owner_id",
                "/edit-boat/:boat_id",
                "/add-property/:user_id",
                "/edit-property/:property_id",
                "/add-unavailability/:owner_id",
                "/edit-unavailability/:unavailability_id",
                "/add-property-unavailability/:owner_id",
            ],
            "/deleted-owners": ["/owner-view/:user_id"],

            "/manage-staff": [
                "/view-staff/:user_id",
                "/add-staff/:user_id",
                "/edit-staff/:user_id",
            ],
            "/deleted-staff": ["/view-staff/:user_id"],

            "/manage-role": ["/add-role", "/edit-role/:role_id"],

            "/manage-trip-type": ["/add-trip-type", "/edit-trip-type/:trip_type_id"],

            "/manage-trips": [
                "/view-trip/:trip_id",
                "/add-trip/:user_id",
                "/edit-trip/:trip_id",
            ],

            "/property-advertisement": [
                "/add-property-advertisement/:user_id",
                "/edit-property-advertisement/:user_id/:property_ad_id",
                "/view-property-advertisement/:property_ad_id",
            ],

            "/manage-destination": ["/add-destination", "/edit-destination/:destination_id"],

            "/manage-faq": ["/view-faq/:faq_id"],

            "/manage-sub-admin": [
                "/add-sub-admin",
                "/edit-sub-admin/:user_id",
                "/view-sub-admin/:user_id",
            ],

            "/manage-addons": ["/view-addons/:addon_id"],

            "/manage-food-category": [
                "/add-food-category",
                "/edit-food-category/:food_category_id",
            ],

            "/manage-food-sub-category": [
                "/add-food-sub-category",
                "/edit-food-sub-category/:food_sub_category_id",
            ],

            "/manage-equipments": [
                "/add-equipment",
                "/edit-equipment/:equipment_id",
            ],

            "/manage-activity": [
                "/add-activity",
                "/edit-activity/:activity_id",
            ],
        }),
        []
    );

    const normalizePath = (value) => {
        if (!value) return "/";
        const trimmed = value.length > 1 ? value.replace(/\/+$/, "") : value;
        return trimmed || "/";
    };

    const buildFullPattern = (pattern) => normalizePath(`${APP_PREFIX_PATH}${pattern}`);

    // Optional URL hint to force the sidebar highlight on shared "detail" pages.
    // Example: `/user-profile/:id?sidebar=deleted-users` should highlight `/deleted-users` instead of `/manage-users`.
    const sidebarOverrideBasePath = useMemo(() => {
        const raw = new URLSearchParams(search || "").get("sidebar");
        if (!raw) return null;

        const cleaned = raw.trim().replace(/^\/+/, "");
        if (!cleaned) return null;

        return normalizePath(`/${cleaned}`);
    }, [search]);

    const isRouteActive = (basePath) => {
        if (!basePath) return false;

        const normalizedPathname = normalizePath(currentPath);

        // Always allow direct matches.
        const fullBasePath = buildFullPattern(basePath);
        const isDirectMatch = !!matchPath({ path: fullBasePath, end: false }, normalizedPathname);
        if (isDirectMatch) return true;

        // When an override is present, only the overridden base path can use aliases.
        // When no override is present, we intentionally do NOT apply aliases for `/deleted-*` bases,
        // otherwise shared detail pages (like `/user-profile/:id`) would activate both "Manage" and "Deleted" items.
        const isOverrideOnlyAliasBase = typeof basePath === "string" && basePath.startsWith("/deleted-");
        const allowAliasesForThisBase = sidebarOverrideBasePath
            ? sidebarOverrideBasePath === basePath
            : !isOverrideOnlyAliasBase;
        if (!allowAliasesForThisBase) return false;

        const aliases = pathAliases[basePath] || [];
        return aliases.some((pattern) => {
            const fullPattern = buildFullPattern(pattern);
            return !!matchPath({ path: fullPattern, end: false }, normalizedPathname);
        });
    };

    const activeGroupId = useMemo(() => {
        for (let sidenavIndex = 0; sidenavIndex < sidenavs.length; sidenavIndex += 1) {
            const sidenav = sidenavs[sidenavIndex];
            for (let menuIndex = 0; menuIndex < sidenav.menus.length; menuIndex += 1) {
                const menu = sidenav.menus[menuIndex];
                if (!menu.submenus?.length) continue;

                const hasActiveChild = menu.submenus.some((submenu) => isRouteActive(submenu.path));
                if (hasActiveChild) return `${sidenavIndex}-${menuIndex}`;
            }
        }
        return null;
    }, [currentPath]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Collapse any manually opened parent group on navigation.
        // The active group (if any) is still opened automatically from the router path.
        setManualOpenMenuId(null);
        setActiveGroupManuallyClosed(false);
    }, [currentPath]);

    const handleParentToggle = (menuId, isActiveGroup) => {
        if (isActiveGroup) {
            setActiveGroupManuallyClosed((prev) => !prev);
            return;
        }

        setManualOpenMenuId((prev) => (prev === menuId ? null : menuId));
    };

    return (
        <aside
            ref={sidebarRef}
            className={`mc-sidebar thin-scrolling ${sidebar && "active"}`}
            onScroll={saveSidebarScrollPosition}
        >
            {sidenavs?.map((sidenav, sidenavIndex) => (
                <menu key={sidenavIndex} className="mc-sidebar-menu">
                    <h5 className="mc-sidebar-menu-title">{t(sidenav.title)}</h5>
                    <ul className="mc-sidebar-menu-list">
                        {sidenav.menus.map((menu, menuIndex) => {
                            const IconComponent = iconMap[menu.icon];
                            const menuId = `${sidenavIndex}-${menuIndex}`;
                            const isMenuActive = menu.path ? isRouteActive(menu.path) : false;
                            const isSubmenuActive = menu.submenus?.some((submenu) => isRouteActive(submenu.path));
                            const isMenuOpen =
                                !!menu.submenus?.length &&
                                ((menuId === activeGroupId && !activeGroupManuallyClosed) || menuId === manualOpenMenuId);

                            return (
                                <li
                                    key={menuIndex}
                                    className={`mc-sidebar-menu-item ${isMenuActive || isSubmenuActive ? "active" : ""}`}
                                >
                                    {!!menu.submenus?.length ? (
                                        <>
                                            <button
                                                type="button"
                                                className={`mc-sidebar-menu-btn ${isSubmenuActive ? "active" : ""}`}
                                                onClick={() => {
                                                    saveSidebarScrollPosition();
                                                    handleParentToggle(menuId, menuId === activeGroupId);
                                                }}
                                                aria-expanded={isMenuOpen}
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
                                                style={{ height: isMenuOpen ? "auto" : "0px", overflow: "hidden", transition: "height 0.3s ease" }}
                                            >
                                                {menu.submenus.map((submenu, subIndex) => {
                                                    const isSubActive = isRouteActive(submenu.path);
                                                    const SubIconComponent = iconMap[submenu.icon];
                                                    return (
                                                        <li
                                                            key={subIndex}
                                                            className={`mc-sidebar-dropdown-item ${isSubActive ? "active" : ""}`}
                                                        >
                                                            <Link
                                                                to={`${APP_PREFIX_PATH}${submenu.path}`}
                                                                className={`mc-sidebar-dropdown-link ${isSubActive ? "active" : ""}`}
                                                                // Fix: prevents scroll on navigation
                                                                replace
                                                                onClick={saveSidebarScrollPosition}
                                                            >
                                                                {SubIconComponent && <SubIconComponent />}
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
                                            // Fix: prevents scroll on navigation
                                            replace
                                            onClick={saveSidebarScrollPosition}
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
