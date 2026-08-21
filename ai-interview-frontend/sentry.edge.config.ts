import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment:
    process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  sendDefaultPii: false,

  beforeSend(event) {
    if (event.request) {
      event.request = {
        ...event.request,
        url: event.request.url?.split("?")[0],
        headers: undefined,
        cookies: undefined,
        data: undefined,
      };
    }

    event.extra = undefined;
    return event;
  },
});