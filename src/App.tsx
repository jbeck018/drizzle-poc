import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FaUserAlt } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import { Navigation } from "./components";
import { Events, Users } from "./pages";

const ROUTES = {
  users: "users/",
  events: "events/",
}

const navItems = [
  {
    route: ROUTES.users,
    icon: FaUserAlt,
    name: 'Users',
  },
  {
    route: ROUTES.events,
    icon: FaBoltLightning,
    name: 'Events',
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigation items={navItems} />,
    children: [
      {
        path: ROUTES.users,
        element: <Users />,
      },
      {
        path: ROUTES.events,
        element: <Events />,
      },
    ]
  }
]);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
