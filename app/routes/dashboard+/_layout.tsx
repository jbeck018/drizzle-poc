import { Building2, Home, Settings, Users } from "lucide-react";
import { Navigation } from '#app/components/navigations';
import { ROUTE_PATH as ACCOUNTS_ROUTE } from './accounts';
import { ROUTE_PATH as SETTINGS_ROUTE } from "./settings";
import { ROUTE_PATH as USERS_ROUTE } from './users';

export const ROUTE_PATH = '/dashboard' as const

const topItems = [
  {
    route: ROUTE_PATH,
    icon: Home,
    name: 'Home',
  },
  {
    route: ACCOUNTS_ROUTE,
    icon: Building2,
    name: 'Accounts',
  },
  {
    route: USERS_ROUTE,
    icon: Users,
    name: 'Users',
  },
];

const bottomItems = [
  {
    route: SETTINGS_ROUTE,
    icon: Settings,
    name: 'Settings',
  },
]

export default function Dashboard() {

  return (
      <Navigation topItems={topItems} bottomItems={bottomItems} />
  )
}
