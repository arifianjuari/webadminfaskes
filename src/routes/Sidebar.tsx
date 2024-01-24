import HomeIcon from "../assets/icons/home.svg";
import UsersIcon from "../assets/icons/users.svg";
import FolderIcon from "../assets/icons/folders.svg";
import HealthIcon from "../assets/icons/building-hospital.svg";
import HealthShieldIcon from "../assets/icons/health-shield.svg";

interface SubmenuType {
  path: string;
  name: string;
}

interface RouteType {
  path: string;
  icon: any;
  name: string;
  submenu?: SubmenuType[];
}

const routes: RouteType[] = [
  {
    path: "/",
    icon: <img src={HomeIcon} alt="logo" />,
    name: "Dashboard",
  },
  {
    path: "/users",
    icon: <img src={UsersIcon} alt="logo" />,
    name: "User",
    submenu: [
      {
        path: "/users/active",
        name: "User Aktif",
      },
      {
        path: "/users/approval",
        name: "Approval",
      },
    ],
  },
  {
    path: "/report-health",
    icon: <img src={FolderIcon} alt="logo" />,
    name: "Laporan Kesehatan",
  },
  {
    path: "/fasility",
    icon: <img src={HealthIcon} alt="logo" />,
    name: "Fasilitas Kesehatan",
  },
  {
    path: "/health-info",
    icon: <img src={HealthShieldIcon} alt="logo" />,
    name: "Info Kesehatan",
  },
];

export default routes;
