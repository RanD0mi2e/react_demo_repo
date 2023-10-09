import { useDeviceInfo } from "@/Context/deviceContext";
import { styled, css } from "styled-components";
import { useState, useMemo, useRef } from "react";
import { leftSwitchArrow, rightSwitchArrow } from "./roleMes";
import { ImgContainer } from "./ImgContainer";
import { throttle } from "@/utils/common";
import { UserInfo } from "@/pages/GenshinRoleSwitch/GenshinRoleSwitch";

export const Carousel: React.FC<{
  currentIndex: number;
  $index: number;
  yuRoleMes: UserInfo[]
  handleModifyIndex: (index: number) => void;
}> = ({ currentIndex, $index, yuRoleMes, handleModifyIndex }) => {
  // 当前城区索引
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [isCloseTranstion, setIsCloseTranstion] = useState(false);
  const { isPC } = useDeviceInfo();

  // 变更索引，切换角色
  function handleIndex(index: number) {
    handleModifyIndex(index);
  }

  // PC点击头像切换角色
  function handleRoleSwitchPC(index: number) {
    setIsCloseTranstion(false);
    handleModifyIndex(index);
  }

  // 点击上一页
  function lastPage(index: number) {
    // 当前处于第一张
    if (index === 0) {
      // 跳转至最后一张
      handleIndex(yuRoleMes.length - 1);
      return;
    }
    handleIndex(index - 1);
  }

  // 点击下一页
  function nextPage(index: number) {
    if (index === yuRoleMes.length - 1) {
      handleIndex(0);
      return;
    }
    handleIndex(index + 1);
  }

  const throttleLastFunc = useRef<((index: number) => void) | undefined>(
    throttle((index) => lastPage(index), 200)
  );
  const throttleNextFunc = useRef<((index: number) => void) | undefined>(
    throttle((index) => nextPage(index), 200)
  );

  //#region
  return (
    <RolePage>
      <RoleOuter
        $isCloseTranstion={isCloseTranstion}
        style={{ width: isPC ? "830px" : "320px" }}
      >
        {/* 分页器箭头 */}
        <>
          <Arrow
            $direction={"left"}
            src={leftSwitchArrow}
            onClick={() => throttleLastFunc.current?.($index)}
          />
          <Arrow
            $direction={"right"}
            src={rightSwitchArrow}
            onClick={() => throttleNextFunc.current?.($index)}
          />
        </>
        {/* 底部头像容器 */}
        <ImgContainer
          currentIndex={currentIndex}
          $index={$index}
          yuRoleMes={yuRoleMes}
          handleRoleSwitchPC={handleRoleSwitchPC}
          handleIndex={handleIndex}
        />
      </RoleOuter>
    </RolePage>
  );
  //#endregion
};

// #region 样式
const Arrow = styled.img<{ $direction?: "left" | "right" }>`
  ${(props) => {
    const commonCss = `
        top: calc(50% - 40px);
        position: absolute;
        background-size: cover;
        cursor: pointer;
        width: 45px;
        height: 64px;
    `;
    switch (props.$direction) {
      case "left":
        return css`
          left: -150px;
          ${commonCss}
        `;
      default:
        return css`
          right: -150px;
          ${commonCss}
        `;
    }
  }}
`;

const RolePage = styled.div`
  width: 100%;
  height: 190px;
  background: rgba(204, 204, 204, 0.2);
  position: fixed;
  bottom: 0;
  z-index: 100;
`;

const RoleOuter = styled.div<{ $isCloseTranstion: boolean }>`
  position: relative;
  width: 830px;
  height: 150px;
  margin: 0 auto;
  ${(props) =>
    props.$isCloseTranstion && "transition: all 0ms ease 0s !important;"}
`;
// #endregion
