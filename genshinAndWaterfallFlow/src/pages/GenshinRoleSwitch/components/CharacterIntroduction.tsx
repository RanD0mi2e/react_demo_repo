import { useDeviceInfo } from "@/Context/deviceContext";
import { styled } from "styled-components";
import { UserInfo } from "../GenshinRoleSwitch";
import { useMemo } from "react";

interface Props {
  yuRoleMes: UserInfo[];
  $index: number;
}

export const CharacterIntroduction: React.FC<Props> = ({
  yuRoleMes,
  $index,
}) => {
  const { isPC } = useDeviceInfo();
  // 角色名
  const roleNameSwitch = useMemo(() => {
    return yuRoleMes[$index].roleName;
  }, [$index, yuRoleMes]);

  // 角色背景介绍
  const introduction = { __html: `<div>${yuRoleMes[$index].roleIntroduce}</div>` };

  //#region tsx结构
  return (
    <>
      <RoleIntroduce style={{ left: isPC ? "20%" : "2%" }}>
        {isPC && <RoleLine />}
        <IntroduceName>{roleNameSwitch}</IntroduceName>
        {isPC && <IntroduceInfo dangerouslySetInnerHTML={introduction} />}
      </RoleIntroduce>
    </>
  );
  //#endregion
};

const RoleIntroduce = styled.div`
  position: absolute;
  top: 15%;
  left: 20%;
  z-index: 11;
`;
const RoleLine = styled.div`
  width: 180px;
  height: 4px;
  background-color: rgb(227, 188, 140);
  margin-bottom: 20px;
`;

const IntroduceName = styled.div`
  font-size: 60px;
  color: #fff;
`;

const IntroduceInfo = styled.div`
  width: 455px;
  background-color: #18212f;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  line-height: 27px;
  background: rgba(1, 1, 1, 0.5);
  margin-top: 20px;
  max-height: 130px;
  overflow-y: auto;
`;
