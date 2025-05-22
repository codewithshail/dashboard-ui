"use client";

import { createContext, useContext, ReactNode } from "react";

interface UserData {
  id: string;
  clerkId: string
  email: string;
  username: string | null;
  image: string | null;
  purchasedCoins: number | null;
  createdAt: Date | null;
}

interface UserContextType {
  user: UserData;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ 
  children, 
  userData 
}: { 
  children: ReactNode;
  userData: UserData;
}) {
  return (
    <UserContext.Provider value={{ user: userData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}