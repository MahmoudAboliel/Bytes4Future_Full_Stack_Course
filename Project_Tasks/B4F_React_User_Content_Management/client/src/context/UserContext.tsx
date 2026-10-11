import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import type { User } from "../lib/types";

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside ThemeProvider");
    return ctx;
}