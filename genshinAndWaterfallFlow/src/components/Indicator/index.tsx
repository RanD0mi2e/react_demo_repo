import { styled, css } from "styled-components";

interface IndicatorProps {
  // 当前城区索引
  currentIndex: number;
  roleSidebar: string[];
  handleModifyCurrentIndex: (currentIndex: number) => void;
}

export const Indicator: React.FC<IndicatorProps> = ({
  currentIndex,
  roleSidebar,
  handleModifyCurrentIndex,
}) => {
  return (
    <Aside>
      {roleSidebar.map((item, index) => {
        return (
          <AsideItem
            key={index}
            onClick={() => handleModifyCurrentIndex(index)}
          >
            <span className={index === currentIndex ? "active" : ""}></span>
            {index === currentIndex && <div className="show-dec">{item}</div>}
          </AsideItem>
        );
      })}
    </Aside>
  );
};

const Aside = styled.ul`
  list-style: none;
  position: fixed;
  left: 20px;
  top: 50%;
  z-index: 100;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
`;

const AsideItem = styled.li`
  height: 20px;
  width: 20px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover .show-dec {
    display: block !important;
  }

  .show-dec {
    text-align: left;
    position: absolute;
    width: 80px;
    left: 24px;
    padding: 1px;
    margin-right: 5px;
    color: #000;
    transition: all linear 0.1s;
    font-size: 15px;
    background-color: #fff;
  }

  span {
    display: inline-block;
    border-radius: 100%;
    border: #fff solid 1px;
    width: 8px;
    height: 8px;
    display: inline-block;
    background-color: #fff;
    transition: all ease-in-out 0.2s;
  }

  &:hover span {
    width: 16px;
    height: 16px;
    background-color: #fff;
    cursor: pointer;
  }

  &.active span {
    /* 根据 Vue 的 active 类添加样式 */
    /* 如果在 React 中也有类似的状态，请在组件中动态添加类名 */
    /* 如：styled-components 中的 props */
    border-color: #000;
    background-color: #000;
  }
`;
