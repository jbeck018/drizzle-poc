import { FaUserAlt } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import { Navigation } from '#app/components/navigation';

export const ROUTE_PATH = '/dashboard' as const

const ROUTES = {
  users: "users",
  events: "events",
}

const navItems = [
  {
    route: ROUTE_PATH + ROUTES.users,
    icon: FaUserAlt,
    name: 'Users',
  },
  {
    route: ROUTE_PATH + ROUTES.events,
    icon: FaBoltLightning,
    name: 'Events',
  },
];

export default function Dashboard() {

  return (
      <Navigation items={navItems} />
  )
}
