import * as React from "react";

// CSS & SCSS
import "./assets/fonts/inter.css";
import "./assets/fonts/material.css";
import "./assets/fonts/icofont/icofont.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/sass/styles.scss";

// JS & COMPONENTS
import "./i18n";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/Themes";
import { SidebarProvider } from "./context/Sidebar";
import { LoaderProvider } from "./context/Preloader";
import { TranslatorProvider } from "./context/Translator";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./pages/auth";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
    AnalyticsPage, UserListPage, DeletedUserListPage, UserProfilePage, OwnerListPage, AddOwner, EditOwner, ViewOwner, DeletedOwnerListPage, StaffListPage, DeletedStaffPage, ViewStaff, RoleListPage, AddRole, EditRole,
    BannerListPage, CityListPage, TripTypeListPage, ReviewRatingLIstPage, AddTripType, CouponCodeListPage, EditTripType, TripListPage, TripViewPage, DestinationListPage, AddDestination, EditDestination, FoodCategoryListPage, AddFoodCategory, EditFoodCategory, FoodSubCategoryListPage, AddFoodSubCategory, EditFoodSubCategory, EquipmentLIstPage, AddEquipments, EditEquipment, ActivityListPage, AddActivity, EditActivity, ManageCommision, ManageEarning, ManageBookingListPage, OwnerTabularReport, StaffTabularReport, StaffAnalyticalReport, EarningTabularReport, AddStaff, AddBoat, AddTrip, EditStaff,
    AdminProfilePage, ContentViewComponent, BroadcastViewPage, UserTabularReport, UserAnalyticalReport, ContactUsListPage, CountryListPage, TripAnalyticalReport, TripReport, AddNewSubAdmin,
    EditSubAdmin,
    ViewSubAdmin,
    ManageChats,
    BroadcastTabularReport,
    ViewAddons,
} from "./pages/main";

import { APP_PREFIX_PATH } from "./constant/constant";
import LogoutComponent from "./pages/LogoutComponent/LogoutComponent";
import OwnerAnalyticalReport from "./pages/main/OwnerAnalyticalReport";
import EarningAnalyticalReport from "./pages/main/EarningAnalticalReport";
import EditBoat from "./pages/main/EditBoat";
import SubAdminListPage from "./pages/main/SubAdminListPage";
import EditTrip from "./pages/main/EditTrip";
import Addunavailability from "./pages/main/Addunavailability";
import EditUnavailability from "./pages/main/EditUnavailability";
import ChatComponent from "./pages/main/ChatComponent";
import AddOns from "./pages/main/AddOns";
import ManageAddOns from "./pages/main/ManageAddOns";
import ManageAddOnsSubcategory from "./pages/main/ManageAddonsSubcategory";
import PromotionReport from "./pages/main/PromotionReport";
import FaqPage from "./pages/main/FaqPage";
import ViewFaq from "./pages/main/ViewFaq";
import HelpAndSupport from "./pages/main/HelpAndSupport";
import ManagePropertyAdvertisement from "./pages/main/ManagePropertyAdvertisement";

const router = createBrowserRouter([

    { path: APP_PREFIX_PATH + "/", element: <LoginPage /> },
    { path: APP_PREFIX_PATH + "/dashboard", element: <AnalyticsPage /> },
    { path: APP_PREFIX_PATH + "/forgot-password", element: <ForgotPasswordPage /> },
    { path: APP_PREFIX_PATH + "/reset-password", element: <RegisterPage /> },
    { path: APP_PREFIX_PATH + "/logout", element: <LogoutComponent /> },
    { path: APP_PREFIX_PATH + "/manage-users", element: <UserListPage /> },
    { path: APP_PREFIX_PATH + "/deleted-users", element: <DeletedUserListPage /> },
    { path: APP_PREFIX_PATH + "/user-profile/:user_id", element: <UserProfilePage /> },
    { path: APP_PREFIX_PATH + "/manage-owners", element: <OwnerListPage /> },
    { path: APP_PREFIX_PATH + "/add-owner", element: <AddOwner /> },
    { path: APP_PREFIX_PATH + "/edit-owner/:user_id", element: <EditOwner /> },
    { path: APP_PREFIX_PATH + "/owner-view/:user_id", element: <ViewOwner /> },
    { path: APP_PREFIX_PATH + "/deleted-owners", element: <DeletedOwnerListPage /> },
    { path: APP_PREFIX_PATH + "/manage-staff", element: <StaffListPage /> },
    { path: APP_PREFIX_PATH + "/deleted-staff", element: <DeletedStaffPage /> },
    { path: APP_PREFIX_PATH + "/view-staff/:user_id", element: <ViewStaff /> },
    { path: APP_PREFIX_PATH + "/manage-role", element: <RoleListPage /> },
    { path: APP_PREFIX_PATH + "/add-role", element: <AddRole /> },
    { path: APP_PREFIX_PATH + "/edit-role/:role_id", element: <EditRole /> },
    { path: APP_PREFIX_PATH + "/manage-banner", element: <BannerListPage /> },
    { path: APP_PREFIX_PATH + "/manage-country", element: <CountryListPage /> },
    { path: APP_PREFIX_PATH + "/manage-city", element: <CityListPage /> },
    { path: APP_PREFIX_PATH + "/help-and-support", element: <HelpAndSupport /> },
    { path: APP_PREFIX_PATH + "/manage-faq", element: <FaqPage /> },
    { path: APP_PREFIX_PATH + "/manage-trip-type", element: <TripTypeListPage /> },
    { path: APP_PREFIX_PATH + "/manage-review-rating", element: <ReviewRatingLIstPage /> },
    { path: APP_PREFIX_PATH + "/add-trip-type", element: <AddTripType /> },
    { path: APP_PREFIX_PATH + "/edit-trip-type/:trip_type_id", element: <EditTripType /> },
    { path: APP_PREFIX_PATH + "/manage-coupon-code", element: <CouponCodeListPage /> },
    { path: APP_PREFIX_PATH + "/manage-trips", element: <TripListPage /> },
    { path: APP_PREFIX_PATH + "/view-trip/:trip_id", element: <TripViewPage /> },
    { path: APP_PREFIX_PATH + "/view-faq/:faq_id", element: <ViewFaq /> },
    { path: APP_PREFIX_PATH + "/manage-destination", element: <DestinationListPage /> },
    { path: APP_PREFIX_PATH + "/add-destination", element: <AddDestination /> },
    { path: APP_PREFIX_PATH + "/edit-destination/:destination_id", element: <EditDestination /> },
    { path: APP_PREFIX_PATH + "/manage-food-category", element: <FoodCategoryListPage /> },
    { path: APP_PREFIX_PATH + "/add-food-category", element: <AddFoodCategory /> },
    { path: APP_PREFIX_PATH + "/edit-food-category/:food_category_id", element: <EditFoodCategory /> },
    { path: APP_PREFIX_PATH + "/manage-food-sub-category", element: <FoodSubCategoryListPage /> },
    { path: APP_PREFIX_PATH + "/add-food-sub-category", element: <AddFoodSubCategory /> },
    { path: APP_PREFIX_PATH + "/edit-food-sub-category/:food_sub_category_id", element: <EditFoodSubCategory /> },
    { path: APP_PREFIX_PATH + "/manage-equipments", element: <EquipmentLIstPage /> },
    { path: APP_PREFIX_PATH + "/add-equipment", element: <AddEquipments /> },
    { path: APP_PREFIX_PATH + "/edit-equipment/:equipment_id", element: <EditEquipment /> },
    { path: APP_PREFIX_PATH + "/manage-activity", element: <ActivityListPage /> },
    { path: APP_PREFIX_PATH + "/add-activity", element: <AddActivity /> },
    { path: APP_PREFIX_PATH + "/edit-activity/:activity_id", element: <EditActivity /> },
    { path: APP_PREFIX_PATH + "/manage-commision", element: <ManageCommision /> },
    { path: APP_PREFIX_PATH + "/manage-earning", element: <ManageEarning /> },
    { path: APP_PREFIX_PATH + "/user-report", element: <UserTabularReport /> },
    { path: APP_PREFIX_PATH + "/owner-report", element: <OwnerTabularReport /> },
    { path: APP_PREFIX_PATH + "/staff-report", element: <StaffTabularReport /> },
    { path: APP_PREFIX_PATH + "/staff-analytical-report", element: <StaffAnalyticalReport /> },
    { path: APP_PREFIX_PATH + "/manage-booking", element: <ManageBookingListPage /> },
    { path: APP_PREFIX_PATH + "/manage-contactus", element: <ContactUsListPage /> },
    { path: APP_PREFIX_PATH + "/user-analytical-report", element: <UserAnalyticalReport /> },
    { path: APP_PREFIX_PATH + "/owner-analytical-report", element: <OwnerAnalyticalReport /> },
    { path: APP_PREFIX_PATH + "/trip-analytical-report", element: <TripAnalyticalReport /> },
    { path: APP_PREFIX_PATH + "/earning-analytical-report", element: <EarningAnalyticalReport /> },
    { path: APP_PREFIX_PATH + "/trip-report", element: <TripReport /> },
    { path: APP_PREFIX_PATH + "/manage-content", element: <ContentViewComponent /> },
    { path: APP_PREFIX_PATH + "/manage-broadcast", element: <BroadcastViewPage /> },
    { path: APP_PREFIX_PATH + "/admin-profile", element: <AdminProfilePage /> },
    { path: APP_PREFIX_PATH + "/earning-tabular-report", element: <EarningTabularReport /> },
    { path: APP_PREFIX_PATH + "/add-staff/:user_id", element: <AddStaff /> },
    { path: APP_PREFIX_PATH + "/add-boat/:owner_id", element: <AddBoat /> },
    { path: APP_PREFIX_PATH + "/edit-boat/:boat_id", element: <EditBoat /> },
    { path: APP_PREFIX_PATH + "/add-trip/:user_id", element: <AddTrip /> },
    { path: APP_PREFIX_PATH + "/add-property-advertisement/:user_id", element: <ManagePropertyAdvertisement /> },
    { path: APP_PREFIX_PATH + "/edit-trip/:trip_id", element: <EditTrip /> },
    { path: APP_PREFIX_PATH + "/edit-staff/:user_id", element: <EditStaff /> },
    { path: APP_PREFIX_PATH + "/add-unavailability/:owner_id", element: <Addunavailability /> },
    { path: APP_PREFIX_PATH + "/edit-unavailability/:unavailability_id", element: <EditUnavailability /> },
    { path: APP_PREFIX_PATH + "/manage-sub-admin", element: <SubAdminListPage /> },
    { path: APP_PREFIX_PATH + "/add-sub-admin", element: <AddNewSubAdmin /> },
    { path: APP_PREFIX_PATH + "/edit-sub-admin/:user_id", element: <EditSubAdmin /> },
    { path: APP_PREFIX_PATH + "/view-sub-admin/:user_id", element: <ViewSubAdmin /> },
    { path: APP_PREFIX_PATH + "/manage-chats", element: <ChatComponent /> },
    { path: APP_PREFIX_PATH + "/broadcast-report", element: <BroadcastTabularReport /> },
    { path: APP_PREFIX_PATH + "/manage-addons", element: <ManageAddOns /> },
    { path: APP_PREFIX_PATH + "/addons-subcategory", element: <ManageAddOnsSubcategory /> },
    { path: APP_PREFIX_PATH + "/view-addons/:addon_id", element: <ViewAddons /> },
    { path: APP_PREFIX_PATH + "/promotion-report", element: <PromotionReport /> },





    // { path: APP_PREFIX_PATH + "/manage-consultation-payment", element: <ManageConsultationPayment /> },
    // { path: APP_PREFIX_PATH + "/manage-treatment", element: <TreatmentPage /> },

    // { path: APP_PREFIX_PATH + "/deleted-doctors", element: <DeletedDoctorviewPage /> },



    // { path: APP_PREFIX_PATH + "/view-consultation/:consultation_id", element: <ConsultationviewPage /> },
    // { path: APP_PREFIX_PATH + "/manage-downpayment", element: <DownPaymentListPage /> },

    // { path: APP_PREFIX_PATH + "/consultation-report", element: <ConsultationReport /> },

    // { path: APP_PREFIX_PATH + "/doctor-analytical-report", element: <DoctorAnalyticalReport /> },

    // { path: APP_PREFIX_PATH + "/appointment-earning", element: <AppointmentEarningReport /> },
    // { path: APP_PREFIX_PATH + "/consultation-earning", element: <ConsultationEarningReport /> },







]);


createRoot(document.getElementById("root")).render(

    <HelmetProvider>
        <ThemeProvider>
            <LoaderProvider>
                <TranslatorProvider>
                    <SidebarProvider>
                        <RouterProvider router={router} />
                    </SidebarProvider>
                </TranslatorProvider>
            </LoaderProvider>

        </ThemeProvider>
    </HelmetProvider>
);