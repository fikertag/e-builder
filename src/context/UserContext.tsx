"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string | null;
  roles?: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (data?.user) {
        const userData: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          emailVerified: data.user.emailVerified,
          image: data.user.image ?? null,
          role: data.user.role ?? null,
          roles: data.user.roles ?? null,
        };
        setUser(userData);
      }
      setIsLoading(false);
    }
  }, [data, isPending]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
