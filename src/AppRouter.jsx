import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Auth } from "./@pages_v2/Auth";
import SignIn from "./components/registration/SignIn";
import SignUp from "./components/registration/SignUp";
import SignUpVerification from "./components/registration/SignUpVerification";
import ForgotPassword from "./components/registration/ForgotPassword";

//Dashboard
import Layoutv2 from "./@pages_v2/DashboardContainer";
import Dashboard from "./components/dashboard/dashboard";
import Accounts from "./components/dashboard/accounts";
import Transactions from "./components/dashboard/payments";
import Cards from "./components/dashboard/cards";
import Settings from "./components/dashboard/settings";
import Remittance from "./components/dashboard/remittance";

const AppRouter = () => {
  const location = useLocation();

  // Define the routes where Sidebar should not be shown
  const noSidebarRoutes = [
    "/",
    "/sign-up",
    "/verification",
    "/business-details",
    "/account-setup",
    "/account-setup-2",
    "/subscription",
    "/forgotpassword",
    "/2fa",
    "/temporary-password",
  ];

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth children={<SignIn />} />} />
        <Route path="/sign-up" element={<Auth children={<SignUp />} />} />
        <Route
          path="/verification"
          element={<Auth children={<SignUpVerification />} />}
        />
        <Route
          path="/forgotpassword"
          element={<Auth children={<ForgotPassword />} />}
        />

        <Route
          path="/dashboard"
          element={<Layoutv2 children={<Dashboard />} />}
        />

        <Route
          path="/accounts"
          element={<Layoutv2 children={<Accounts />} />}
        />

        <Route
          path="/transactions"
          element={<Layoutv2 children={<Transactions />} />}
        />

        <Route path="/cards" element={<Layoutv2 children={<Cards />} />} />
        <Route
          path="/remittance"
          element={<Layoutv2 children={<Remittance />} />}
        />

        <Route
          path="/settings"
          element={<Layoutv2 children={<Settings />} />}
        />

        <Route
          path="/settings/kyb"
          element={<Layoutv2 children={<Settings />} />}
        />

        <Route
          path="/settings/kyc"
          element={<Layoutv2 children={<Settings />} />}
        />
        {/* <Route
          path="/2fa"
          element={<Auth children={TwoFactorAuth} />}
        /> */}
        {/*<Route
          path="/business-details"
          element={<Layout children={<Auth children={BusinessDetails} />} />}
        />
        <Route
          path="/account-setup"
          element={<Layout children={<Auth children={AccountSetup} />} />}
        />
        <Route
          path="/account-setup-2"
          element={<Layout children={<Auth children={AccountSetup2} />} />}
        />
        <Route
          path="/subscription"
          element={<Layout children={<Subscription />} />}
        />
        <Route
          path="/forgotpassword"
          element={<Layout children={<Auth children={ForgotPassword} />} />}
        />
        <Route
          path="/2fa"
          element={<Layout children={<Auth children={TwoFactorAuth} />} />}
        />
        <Route
          path="/temporary-password"
          element={<Layout children={<Auth children={TemporaryPassword} />} />}
        />

        
        <Route
          path="/accounts/conversion"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/accounts/statements"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/payments"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/beneficiaries"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/request-money"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/send-money"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/transactions"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/request-money/create-request"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/expense"
          element={<Layoutv2 children={<ExpenseHome />} />}
        />
        <Route
          path="/expense/invoices"
          element={<Layoutv2 children={<Verification />} />}
        />
        <Route
          path="/expense/bills"
          element={<Layoutv2 children={<Bills />} />}
        />

        <Route
          path="/expense/bills/payments"
          element={<Layoutv2 children={<BillPayment />} />}
        />

        <Route
          path="/expense/bills/createbill"
          element={<Layoutv2 children={<CreateRequest />} />}
        />
        <Route
          path="/expense/invoices/create-invoice"
          element={<Layoutv2 children={<CreateRequestinvoice />} />}
        />
        <Route
          path="/settings/*"
          element={<Layoutv2 children={<SettingsHome />} />}
        />
        <Route
          path="/settings/subscription/payment-history"
          element={<Layoutv2 children={<PaymentHistory />} />}
        />
        <Route
          path="/compare-plans"
          element={<Layoutv2 children={<CompareAllPlans />} />}
        />
        <Route
          path="/expense/corporate-cards"
          element={<Layoutv2 children={<Cards />} />}
        />
        <Route
          path="/expense/corporate-cards/create-card"
          element={<Layoutv2 children={<CreateCard />} />}
        />
        <Route
          path="/payments/track-payment"
          element={<Layoutv2 children={<PaymentTracker />} />}
        />
        <Route
          path="/payments/rfi"
          element={<Layoutv2 children={<PaymentRFI />} />}
        />
        <Route
          path="/onboarding/Home"
          element={<Layoutv2 children={<Onboarding />} />}
        />
        <Route
          path="/onboarding/rfi"
          element={<Layoutv2 children={<RFIDetails />} />}
        />
        <Route
          path="/access-control/*"
          element={<Layoutv2 children={<AccessControlHome />} />}
        />
        <Route path="/profile" element={<Layoutv2 children={<Profile />} />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/session" element={<Layoutv2 children={<Session />} />} />
        <Route
          path="/dashboard"
          element={<Layoutv2 children={<Dashboardv2 />} />}
        />
        <Route
          path="/accounts"
          element={<Layoutv2 children={<AccountsHome />} />}
        /> */}
      </Routes>
    </>
  );
};

export default AppRouter;
