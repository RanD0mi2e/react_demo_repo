import { Carousel } from "@/components/Carousel";
import {
  yuRoleInfo,
  roleSidebar,
  outerBackground,
} from "@/components/Carousel/roleMes";
import { Indicator } from "@/components/Indicator";
import { useState, useMemo } from "react";
import { CharacterIntroduction } from "./components/CharacterIntroduction";
import { useDeviceInfo } from "@/Context/deviceContext";
import { styled, keyframes } from "styled-components";

// 角色信息列表
export interface UserInfo {
  roleAvatar: string;
  roleName: string;
  roleBackground: string;
  roleIntroduce: string;
}

export const GenshinRoleSwitch = () => {
  // 当前城区索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 轮播图当前选中头像索引
  const [$index, setIndex] = useState(0);
  const { isPC } = useDeviceInfo();

  // 根据当前索引获取角色信息
  const currentRoleInfeo = useMemo(() => {
    return yuRoleInfo[currentIndex];
  }, [currentIndex]);

  const yuRoleMes = useMemo(() => {
    let arr: UserInfo[] = [];
    currentRoleInfeo.roleAvatar.forEach((item, index) => {
      arr.push({
        roleAvatar: item,
        roleName: currentRoleInfeo.roleName[index],
        roleBackground: isPC
          ? currentRoleInfeo.roleBackground[index]
          : currentRoleInfeo.roleBackgroundMobile[index],
        roleIntroduce: currentRoleInfeo.roleIntroduce[index],
      });
    });
    return arr;
  }, [currentRoleInfeo, isPC]);

  // 两张背景图 切换
  const outerTwoBackground = useMemo(() => {
    return outerBackground[currentIndex];
  }, [currentIndex]);

  function handleChangeRole(index: number) {
    setCurrentIndex(index);
    setIndex(0);
  }

  return (
    <Main>
      {/* 指示器 */}
      <Indicator
        currentIndex={currentIndex}
        roleSidebar={roleSidebar}
        handleModifyCurrentIndex={handleChangeRole}
      />
      {/* 轮播图 */}
      <Carousel
        currentIndex={currentIndex}
        $index={$index}
        yuRoleMes={yuRoleMes}
        handleModifyIndex={setIndex}
      />
      {/* 角色介绍 */}
      <CharacterIntroduction yuRoleMes={yuRoleMes} $index={$index} />
      {/* 背景装饰 灰色斜背景 */}
      <TiltBackground />
      {/* 背景装饰 花图案 */}
      <FlowerDecoration src="https://uploadstatic.mihoyo.com/contentweb/20200220/2020022016441018411.png" />
      {/* 背景 动画切换 */}
      <BackgroundWrapper>
        <RoleBg1 $url={outerTwoBackground[0]} />
        <RoleBg2 $url={outerTwoBackground[1]} />
      </BackgroundWrapper>
      {/* 角色背景 */}
      <RoleWrapper>
        <RoleBox>
          {yuRoleMes.map((item, index) => {
            return <RolePicture key={index} src={item.roleBackground} className={index === $index ? 'show-background-pc' : 'hide-background'} />;
          })}
        </RoleBox>
      </RoleWrapper>
    </Main>
  );
};

//#region 样式
const Main = styled.main`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #ccc;
`;

const TiltBackground = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background-image: url("https://ys.mihoyo.com/main/_nuxt/img/6c9d197.png");
  background-position: center bottom;
`;

const FlowerDecoration = styled.img`
  width: auto;
  height: 378px;
  position: absolute;
  top: 10%;
  left: 15%;
  z-index: 1;
  background-position: center bottom;
  opacity: 0.3;
`;

const BackgroundWrapper = styled.div``;

// 背景图伸缩
const BreathAnimation = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
`;

// 第二张背景图显示/隐藏
const BgChange = keyframes`
  48% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  98% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const RoleBackground = styled.div<{ $url: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  transform-origin: center;
  background-image: ${(props) => props.$url};
`;

// 样式继承
const RoleBg1 = styled(RoleBackground)`
  animation: ${BreathAnimation} 80s infinite linear;
  opacity: 1;
`;

const RoleBg2 = styled(RoleBackground)`
  animation: ${BgChange} 15s infinite linear,
    ${BreathAnimation} 80s infinite linear;
  opacity: 0;
`;

const RoleWrapper = styled.div`
  overflow: hidden;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  z-index: 10;
`;

const RoleBox = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const RolePicture = styled.img`
  position: absolute;
  height: 100%;

  &.show-background-pc {
    right: 0;
    opacity: 1;
    transition: all 0.3s;
  }

  &.hide-background {
    right: -1000px;
    opacity: 0;
    transition: all 0.3s;
  }
`;

const ShowRolePicture = styled(RolePicture)`
  right: 0;
  opacity: 1;
  transition: all 0.3s;
`;

const HideRolePicture = styled(RolePicture)`
  right: -1000px;
  opacity: 0;
  transition: all 0.3s;
`;
//#endregion
