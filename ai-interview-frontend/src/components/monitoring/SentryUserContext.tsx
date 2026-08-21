"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useAuthStore } from "@/store/authStore";

export function SentryUserContext() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const userEmail = user?.email;

  useEffect(() => {
    Sentry.setUser(
      userId && userEmail
        ? {
            id: userId,
            email: userEmail,
          }
        : null,
    );
  }, [userId, userEmail]);

  return null;
}