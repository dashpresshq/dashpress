import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import styled from "styled-components";

export const SystemIcons = {
  ShoppingCart: `<path d="M10 21a1 1 0 11-2 0 1 1 0 012 0zM21 21a1 1 0 11-2 0 1 1 0 012 0zM1 1h4l2.68 13.39c.188.925.995 1.61 1.962 1.61h.04-.002H19.438a2 2 0 001.959-1.597l.002-.013 1.6-8.39h-17" />`,
  Activity: `<path d="M22 12h-4l-3 9L9 3l-3 9H2" />`,
  ShoppingBag: `<path d="M6 2L3 6v14a2 2 0 002 2v0h14a2 2 0 002-2v0V6l-3-4zM3 6h18" /><path d="M16 10a4 4 0 01-8 0v0" />`,
  Users: `<path d="M17 21v-2a4 4 0 00-4-4v0H5a4 4 0 00-4 4v2M13 7a4 4 0 11-8 0 4 4 0 018 0zM23 21v-2a4.002 4.002 0 00-2.972-3.864L20 15.13M16 3.13c1.743.457 3.008 2.018 3.008 3.875s-1.265 3.418-2.98 3.869L16 10.88" />`,
  Award: `<path d="M19 8A7 7 0 115 8a7 7 0 0114 0z" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />`,
  Download: `<path d="M21 15v4a2 2 0 01-2 2v0H5a2 2 0 01-2-2v0-4M7 10l5 5 5-5M12 15V3" />`,
  Mail: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" />`,
  Star: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />`,
  Clock: `<path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /><path d="M12 6v6l4 2" />`,
  BarChart: `<path d="M12 20V10M18 20V4M6 20v-4" />`,
  Bell: `<path d="M18 8A6 6 0 106 8v0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2.002 2.002 0 01-3.455.009L10.27 21" />`,
  Box: ` <path d="M21 16V8a2 2 0 00-.991-1.725L20 6.27l-7-4c-.287-.168-.632-.268-1-.268s-.713.099-1.009.273L11 2.27l-7 4A2.003 2.003 0 003 8v8a2 2 0 00.991 1.725L4 17.73l7 4c.287.168.632.268 1 .268s.713-.099 1.009-.273L13 21.73l7-4A2.003 2.003 0 0021 16v0z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />`,
  Calendar: `<path d="M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM16 2v4M8 2v4M3 10h18" />`,
  CheckSquare: `  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2v0H5a2 2 0 01-2-2v0V5a2 2 0 012-2v0h11" />`,
  CreditCard: `<path d="M3 4h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2zM1 10h22" />`,
  Database: `<path d="M21 5c0 1.657-4.029 3-9 3S3 6.657 3 5s4.029-3 9-3 9 1.343 9 3zM21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />`,
  DollarSign: `<path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7v0h5a3.5 3.5 0 110 7v0H6" />`,
  File: `<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2v0h12a2 2 0 002-2v0V9z" /><path d="M13 2v7h7" />`,
  Folder: `<path d="M22 19a2 2 0 01-2 2v0H4a2 2 0 01-2-2v0V5a2 2 0 012-2v0h5l2 3h9a2 2 0 012 2v0z" />`,
  Gift: `<path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7H7.5a2.5 2.5 0 110-5v0C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5v0C13 2 12 7 12 7z" />`,
  Globe: ` <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM2 12h20" /><path d="M12 2a15.235 15.235 0 014 9.983V12a15.254 15.254 0 01-4.01 10.011l.01-.012a15.235 15.235 0 01-4-9.983v-.017a15.254 15.254 0 014.01-10.011L12 2z" />`,
  Heart: `<path d="M20.84 4.61c-.995-.996-2.371-1.612-3.89-1.612s-2.895.616-3.89 1.612L12 5.67l-1.06-1.06a5.501 5.501 0 00-7.78 7.78L12 21.23l8.84-8.84c.996-.995 1.612-2.371 1.612-3.89s-.616-2.895-1.612-3.89h0z" />`,
  Home: `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2v0H5a2 2 0 01-2-2v0z" /><path d="M9 22V12h6v10" /><path d="M9 22V12h6v10" />`,
  Image: `<path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /><path d="M10 8.5a1.5 1.5 0 11-3.001-.001A1.5 1.5 0 0110 8.5zM21 15l-5-5L5 21" />`,
  Flow: `<path d="M21 18a3 3 0 11-6 0 3 3 0 016 0zM9 6a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M13 6h3a2 2 0 012 2v7M6 9v12" />`,
  Info: `<path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM12 16v-4M12 8h.01" />`,
  Link: `<path d="M10 13a4.998 4.998 0 007.54.54l3-3a5 5 0 00-7.071-7.069l.001-.001-1.72 1.71" /><path d="M14 11a4.998 4.998 0 00-7.54-.54l-3 3a5 5 0 007.071 7.069l-.001.001 1.71-1.71" />`,
  Lock: `<path d="M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2zM7 11V7a5 5 0 0110 0v4" />`,
  Map: `<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16" />`,
  Monitor: `<path d="M4 3h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zM8 21h8M12 17v4" />`,
  Phone: `<path d="M22 16.92v3.008a2 2 0 01-2.188 1.991l.008.001c-3.245-.362-6.177-1.457-8.705-3.116l.075.046a19.647 19.647 0 01-5.953-5.923l-.047-.077a19.54 19.54 0 01-3.062-8.582L2.12 4.18A2 2 0 014.11 2h3.02a2 2 0 011.979 1.709l.001.011c.141 1.05.386 1.998.73 2.898l-.03-.088a1.994 1.994 0 01-.45 2.11L8.09 9.91a16.126 16.126 0 005.923 5.959l.077.041 1.27-1.27a1.994 1.994 0 012.123-.445l-.014-.005c.812.314 1.76.559 2.744.693l.066.007A2.003 2.003 0 0122 16.87l-.001.052v-.003z" />`,
  PieChart: `<path d="M21.21 15.89c-1.559 3.618-5.094 6.105-9.21 6.105-5.523 0-10-4.477-10-10 0-4.076 2.439-7.583 5.937-9.14l.064-.025" /><path d="M22 12c0-5.523-4.477-10-10-10v10z" />`,
  Shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />`,
  Server: `<path d="M4 2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zM4 14h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2zM6 6h.01M6 18h.01" />`,
  Smartphone: `<path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01" />`,
  Truck: `<path d="M1 3h15v13H1V3zM16 8h4l3 3v5h-7V8z" /><path d="M8 18.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM21 18.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />`,
  Tv: `<path d="M4 7h16a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zM17 2l-5 5-5-5" />`,
  UserPlus: `<path d="M16 21v-2a4 4 0 00-4-4v0H5a4 4 0 00-4 4v2M12.5 7a4 4 0 11-8 0 4 4 0 018 0zM20 8v6M23 11h-6" />`,
  UserCheck: `<path d="M16 21v-2a4 4 0 00-4-4v0H5a4 4 0 00-4 4v2M12.5 7a4 4 0 11-8 0 4 4 0 018 0zM17 11l2 2 4-4" />`,
  Wifi: `<path d="M5 12.55c1.893-1.585 4.354-2.548 7.04-2.548s5.147.963 7.057 2.562l-.017-.014M1.42 9C4.225 6.518 7.936 5.003 12 5.003s7.775 1.515 10.597 4.012L22.58 9M8.53 16.11c.966-.693 2.172-1.109 3.475-1.109s2.509.415 3.493 1.121l-.018-.012M12 20h.01" />`,
  Zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />`,
  User: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4" />`,
  Settings: `<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`,
};

export type SystemIconsKeys = keyof typeof SystemIcons;

export const SystemIconsList = Object.keys(SystemIcons);

export const systemIconToSVG = (icon: string, strokeWidth = 2) => {
  let iconPath = SystemIcons[icon];
  if (!iconPath) {
    return icon;
  }

  iconPath = iconPath.replaceAll(
    `<path `,
    `<path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="${strokeWidth}" stroke="currentColor" `
  );

  iconPath = iconPath.replaceAll(
    `<circle `,
    `<circle fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="${strokeWidth}" stroke="currentColor" `
  );

  iconPath = iconPath.replaceAll(
    `<polygon `,
    `<polygon fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="${strokeWidth}" stroke="currentColor" `
  );

  return `<svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                ${iconPath}
              </svg>`;
};

const GrabRoot = styled.svg`
  cursor: grab;
  fill: ${USE_ROOT_COLOR("main-text")};
  touch-action: none;
`;

export function GrabIcon({
  width,
  className,
}: {
  width?: number;
  className?: string;
}) {
  // :eyes document.body.style.setProperty("cursor", "grabbing");

  return (
    <GrabRoot viewBox="0 0 20 20" width={width || 12} className={className}>
      <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
    </GrabRoot>
  );
}
