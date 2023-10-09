import { isPCSystem } from "@/utils/common";
import React, { ReactNode, createContext, useContext } from "react";

export interface DeviceType {
  isPC: Boolean;
}

const deviceType: DeviceType = {
  isPC: isPCSystem(),
};
const DeviceContext = createContext(deviceType);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <DeviceContext.Provider value={deviceType}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceInfo = () => {
    return useContext(DeviceContext)
}
