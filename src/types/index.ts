export interface Category {
  id?: number;
  name: string;
  is_active: boolean;
}

export interface DataProfile {
  name: string;
  email: string;
}

export interface FormValues {
    email: string;
    password: string;
}

export interface FetchListResult<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
  refresh: () => void;
}

export interface UserProfileContextType {
  userProfile: DataProfile | null;
  setUserProfileData: (data: DataProfile | null) => void;
}
