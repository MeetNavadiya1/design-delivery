import { create } from "zustand";

export const userStore = create((set) => ({
  user: {
    id: null,
    name: "user",
    role: null,
    email: "user@user.com",
    avatar: "/avatars/shadcn.jpg",
  },

  setUser: (userData) => {
    set({
      user: {
        id: userData?.id || null,
        name: userData?.name || null,
        email: userData?.email || null,
        role: userData?.role || null,
        avatar: userData?.avatar || null,
      },
    });
  },
}));
