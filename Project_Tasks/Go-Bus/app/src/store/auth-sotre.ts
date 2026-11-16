import { UserRes } from "@/lib/types";
import * as SecureStore from "expo-secure-store";
import { atom } from "jotai";

export type AuthType = {
  token: string | null;
  user: UserRes["data"]["user"] | null;
};

const KEY = "auth";
const EMPTY: AuthType = { token: null, user: null };

export const authAtom = atom<AuthType>(EMPTY);

export const loadAuthAtom = atom(null, async (_WORKLET_RUNTIME, set) => {
  const raw = await SecureStore.getItemAsync(KEY);
  if (raw) {
    try {
      set(authAtom, JSON.parse(raw));
    } catch {}
  }
});

export const loginAtom = atom(null, async (_, set, auth: AuthType) => {
  set(authAtom, auth);
  await SecureStore.setItemAsync(KEY, JSON.stringify(auth));
});

export const logoutAtom = atom(null, async (_, set) => {
  set(authAtom, EMPTY);
  SecureStore.deleteItemAsync(KEY);
});
