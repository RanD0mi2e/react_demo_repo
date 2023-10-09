import { useDeviceInfo } from "@/Context/deviceContext";
import { styled, css } from "styled-components";
import { useState, useMemo } from "react";
import { UserInfo } from "@/pages/GenshinRoleSwitch/GenshinRoleSwitch";
import { bottomRoleBac } from "./roleMes";

interface ImgContainerProps {
  currentIndex: number; // 当前城区索引
  $index: number; // 当前选中头像索引
  yuRoleMes: UserInfo[];
  handleRoleSwitchPC: (index: number) => void; // 点击头像切换角色
  handleIndex: (index: number) => void; // 切换角色
}
export const ImgContainer: React.FC<ImgContainerProps> = ({
  $index,
  yuRoleMes,
  handleRoleSwitchPC,
  handleIndex,
}) => {
  const isPC = useDeviceInfo();

  //#region 底部点击操作
  // 每次点击移动距离
  const moveDistance = useMemo(() => {
    if (isPC) {
      // 前三张固定位移
      const firstThree = $index < 3;
      if (firstThree) return 0;

      // 第一张往左移动 跳到最后一页
      // 后四张往右移动时，如果是后四张就固定位移，不是就移动位移即可
      const lastThree = $index > yuRoleMes.length - 4; // 判断是否是后三张
      if (!lastThree) return ($index - 2) * -144;

      // 固定位移后四张
      return (yuRoleMes.length - 6) * -144;
    }
  }, [isPC, $index, yuRoleMes.length]);

  // 判断是不是前三张 || 后三张
  const moveDistancePC = useMemo(() => {
    return moveDistance + "px";
  }, [moveDistance]);
  //#endregion

  //#region tsx结构
  return (
    <RoleContenter>
      <RoleInner style={{ left: isPC ? moveDistancePC : "moveDistanceMobile" }}>
        {isPC
          ? yuRoleMes.map((item, index: number) => (
              <RoleItemPC
                $isActive={$index === index}
                onClick={() => {
                  handleRoleSwitchPC(index);
                }}
                key={index}
              >
                <ItemAvater src={item.roleAvatar} />
                <ItemName $isActive={$index === index}>
                  {item.roleName}
                </ItemName>
              </RoleItemPC>
            ))
          : yuRoleMes.map((item: any, index: number) => (
              <RoleItemMobile key={index}></RoleItemMobile>
            ))}
      </RoleInner>
    </RoleContenter>
  );
  //#endregion
};

//#region 样式
const RoleContenter = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: 100%;
`;

const RoleInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  transition: all ease-in-out 0.3s;
`;

const ItemName = styled.p<{ $isActive: boolean }>`
  font-size: 16px;
  text-align: center;
  width: 100%;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  line-height: 22px;
  margin: 0;
  color: ${(props) => (props.$isActive ? "#000" : "#fff")};
`;

const RoleItemPC = styled.div<{ $isActive: boolean }>`
  position: relative;
  margin-right: 34px;
  width: 110px;
  height: 132px;
  background-position: ${(props) => (props.$isActive ? "0 -132px" : "")};
  background-image: url(${bottomRoleBac});

  &:hover {
    cursor: pointer;
    background-position: 0 -132px;

    ${ItemName} {
      color: #000 !important;
    }
  }
`;

const ItemAvater = styled.img`
  display: block;
  margin: 2px auto 0;
  width: 105px;
  height: 105px;
`;

const RoleItemMobile = styled.div`
  width: 64px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ItemAvaterMobile = styled.img`
  width: 55px;
  height: 55px;
  padding-top: 8px;
`;

const ItemNameMobile = styled.p`
  font-size: 14px;
  height: 17px;
  text-align: center;
  width: 100%;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin: 0;
`;
//#endregion
