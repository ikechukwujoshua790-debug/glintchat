import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { Logo } from "./components/Logo";

// Lazy-loaded pages
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const SignupPage = lazy(() =>
  import("./pages/SignupPage").then((m) => ({ default: m.SignupPage })),
);
const ChatsIndexPage = lazy(() =>
  import("./pages/ChatsIndex").then((m) => ({ default: m.ChatsIndexPage })),
);
const ChatDetailPage = lazy(() =>
  import("./pages/ChatDetail").then((m) => ({ default: m.ChatDetailPage })),
);
const GroupsPage = lazy(() =>
  import("./pages/GroupsPage").then((m) => ({ default: m.GroupsPage })),
);
const GroupDetailPage = lazy(() =>
  import("./pages/GroupDetail").then((m) => ({ default: m.GroupDetailPage })),
);
const StatusPage = lazy(() =>
  import("./pages/StatusPage").then((m) => ({ default: m.StatusPage })),
);
const ChannelsPage = lazy(() =>
  import("./pages/ChannelsPage").then((m) => ({ default: m.ChannelsPage })),
);
const ChannelDetailPage = lazy(() =>
  import("./pages/ChannelDetail").then((m) => ({
    default: m.ChannelDetailPage,
  })),
);
const VerifyPage = lazy(() =>
  import("./pages/VerifyPage").then((m) => ({ default: m.VerifyPage })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const MorePage = lazy(() =>
  import("./pages/MorePage").then((m) => ({ default: m.MorePage })),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Logo size={40} />
    </div>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

// Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => <SignupPage />,
});
const chatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats",
  component: () => <ChatsIndexPage />,
});
const chatDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats/$userId",
  component: () => <ChatDetailPage />,
});
const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: () => <GroupsPage />,
});
const groupDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups/$groupId",
  component: () => <GroupDetailPage />,
});
const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/status",
  component: () => <StatusPage />,
});
const channelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/channels",
  component: () => <ChannelsPage />,
});
const channelDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/channels/$channelId",
  component: () => <ChannelDetailPage />,
});
const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify",
  component: () => <VerifyPage />,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => <AdminPage />,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => <PrivacyPage />,
});
const moreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/more",
  component: () => <MorePage />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <ChatsIndexPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  chatsRoute,
  chatDetailRoute,
  groupsRoute,
  groupDetailRoute,
  statusRoute,
  channelsRoute,
  channelDetailRoute,
  verifyRoute,
  adminRoute,
  privacyRoute,
  moreRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
