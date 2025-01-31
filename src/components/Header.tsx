import React from "react";
import { useServiceOrders } from "./ServiceOrderProvider";
import NotificationBell from "./NotificationBell";
import DeadlineNotificationBell from "./notifications/DeadlineNotificationBell";
import UserProfile from "./UserProfile";

const Header = () => {
  const { serviceOrders } = useServiceOrders();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 gap-4">
      <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Daily.Flow
      </h1>
      <div className="flex items-center space-x-4">
        <DeadlineNotificationBell serviceOrders={serviceOrders} />
        <NotificationBell serviceOrders={serviceOrders} />
        <UserProfile />
      </div>
    </header>
  );
};

export default Header;