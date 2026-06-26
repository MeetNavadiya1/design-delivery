import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Profile from "./profile";
// import ResetPassword from "./reset-password";

const Settings = () => {
  const [isProfile, setIsProfile] = useState(true);

  return (
    <>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview" onClick={() => setIsProfile(true)}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="analytics" onClick={() => setIsProfile(false)}>
            Password
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isProfile ? (
        <Profile />
      ) : (
          <></>
        // <ResetPassword />
      )}
    </>
  );
};

export default Settings;
