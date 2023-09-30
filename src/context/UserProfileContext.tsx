import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { DataProfile, UserProfileContextType } from "../types";

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider = ({
  children,
}: UserProfileProviderProps): JSX.Element => {
  const [userProfile, setUserProfile] = useState<DataProfile | null>(null);
  const validate = sessionStorage.getItem("userToken");

  const setUserProfileData = (data: DataProfile | null) => {
    setUserProfile(data);
  };

  useEffect(() => {
    axios.get('https://mock-api.arikmpt.com/api/user/profile',
      { headers: { Authorization: `Bearer ${validate}` } })
      .then((response) => {
        setUserProfile(response.data.data);
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfileData }}>
      {children}
    </UserProfileContext.Provider>
  );
};
