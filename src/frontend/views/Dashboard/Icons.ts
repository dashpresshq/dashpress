export const DashboardIcons: Record<string, string> = {
  ShoppingCart: `<path d="M10 21a1 1 0 11-2 0 1 1 0 012 0zM21 21a1 1 0 11-2 0 1 1 0 012 0zM1 1h4l2.68 13.39c.188.925.995 1.61 1.962 1.61h.04-.002H19.438a2 2 0 001.959-1.597l.002-.013 1.6-8.39h-17" />`,
  Activity: `<path d="M22 12h-4l-3 9L9 3l-3 9H2" />`,
  ShoppingBag: `<path d="M6 2L3 6v14a2 2 0 002 2v0h14a2 2 0 002-2v0V6l-3-4zM3 6h18" /><path d="M16 10a4 4 0 01-8 0v0" />`,
  Users: `<path d="M17 21v-2a4 4 0 00-4-4v0H5a4 4 0 00-4 4v2M13 7a4 4 0 11-8 0 4 4 0 018 0zM23 21v-2a4.002 4.002 0 00-2.972-3.864L20 15.13M16 3.13c1.743.457 3.008 2.018 3.008 3.875s-1.265 3.418-2.98 3.869L16 10.88" />`,
  Award: `<path d="M19 8A7 7 0 115 8a7 7 0 0114 0z" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />`,
  Download: `<path d="M21 15v4a2 2 0 01-2 2v0H5a2 2 0 01-2-2v0-4M7 10l5 5 5-5M12 15V3" />`,
  Mail: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" />`,
  Star: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />`,
  Clock: `<path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /><path d="M12 6v6l4 2" />`,

  //   BarChart,
  // Bell,
  // Box,
  //   Calendar,
  //   CheckSquare,
  //   CreditCard,
  //   Database,
  //   DollarSign,
  //   File,
  //   Folder,
  //   Gift,
  //   Globe,
  //   Heart,
  //   Home,
  //   Image,
  //   Info,
  //   Link,
  //   Lock,
  //   Map,
  //   Monitor,
  //   Phone,
  //   PieChart,
  //   Server,
  //   Smartphone,
  //   Star,
  //   Truck,
  //   Tv,
  //   UserPlus,
  //   UserCheck,
  //   Wifi,
};

export const DashboardIconsList = Object.keys(DashboardIcons);

export const getDashbordIcon = (icon: string) => {
  let iconPath = DashboardIcons[icon];
  if (!iconPath) {
    return icon;
  }
  iconPath = iconPath.replaceAll(
    `<path `,
    `<path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" `
  );
  return `<svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
              ${iconPath}
            </svg>`;
};
