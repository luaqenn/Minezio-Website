"use client";

import { createContext, useEffect, useState } from "react";
import { SignUpRequest, useAuthService } from "@/lib/services/auth.service";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@/lib/types/user";

export const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  setUser: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getMe, signIn: signInService, signUp: signUpService } = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUser(user);
        setIsLoading(false);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };
    fetchUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    const response = await signInService({ username, password });

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const user = await getMe();

    setUser(user);
    setIsAuthenticated(true);
  };

  const signUp = async (data: SignUpRequest) => {
    const response = await signUpService(data);

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const user = await getMe();

    setUser(user);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>;
  }

  return <AuthContext.Provider value={{ user, setUser, isLoading, isAuthenticated, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
};
