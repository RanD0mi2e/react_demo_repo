import styled from "styled-components";
import { useState } from "react";

interface ResizeProps {
  children: React.ReactNode;
}
export const ResizeLayout: React.FC<ResizeProps> = ({ children }) => {
  const [dragging, setDragging] = useState(false);
  const cacheWidth = parseInt(localStorage.getItem("sideWidth") || "");
  const [sideWidth, setSideWidth] = useState(cacheWidth || 150);
  const [startPageX, setStartPageX] = useState(0);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setStartPageX(event.pageX);
    setDragging(true);
  };
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentSideWidth = sideWidth + (event.pageX - startPageX);
    setSideWidth(currentSideWidth);
    setStartPageX(event.pageX);
  };
  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem("sideWidth", String(sideWidth));
  };

  return (
    <Layout
      sideWidth={sideWidth}
      dragging={dragging}
      draggingHandler={{ handleMouseDown, handleMouseMove, handleMouseUp }}
    >
      {children}
    </Layout>
  );
};

interface Props {
  children: React.ReactNode;
  sideWidth?: number;
  dragging?: boolean;
  draggingHandler: {
    handleMouseDown: (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
    handleMouseMove: (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
    handleMouseUp: () => void;
  };
}

export const Layout: React.FC<Props> = ({
  children,
  sideWidth,
  dragging,
  draggingHandler,
}) => {
  return (
    <AppLayout>
      <SideBar $width={sideWidth}>
        SideBar
        <SideResizer
          onMouseDown={(e) => {
            draggingHandler.handleMouseDown(e);
          }}
        ></SideResizer>
      </SideBar>
      <>
        <Header $width={sideWidth}>Header</Header>
        <Content $width={sideWidth}>{children}</Content>
        <Footer $width={sideWidth}>Footer</Footer>
      </>
      {dragging && (
        <ResizeMask
          onMouseMove={draggingHandler.handleMouseMove}
          onMouseUp={draggingHandler.handleMouseUp}
        />
      )}
    </AppLayout>
  );
};

const AppLayout = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
`;

// const SideBar = styled.aside<{ $width: number | undefined }>`
//   position: absolute;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   background-color: pink;
//   width: ${(props) => (props.$width || 150) + "px"};
// `;

const SideBar = styled.aside.attrs<{ $width: number | undefined }>((props) => ({
  style: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'pink',
    width: (props.$width || 150) + "px",
  },
}))``;

// const Header = styled.header<{ $width: number | undefined }>`
//   position: absolute;
//   height: 60px;
//   left: ${(props) => (props.$width || 150) + "px"};
//   top: 0;
//   right: 0;
// `;

const Header = styled.header.attrs<{ $width: number | undefined }>((props) => ({
  style: {
    position: "absolute",
    height: "60px",
    left: (props.$width || 150) + "px",
    top: 0,
    right: 0,
  },
}))``;

// const Content = styled.main<{ $width: number | undefined }>`
//   position: absolute;
//   bottom: 60px;
//   top: 60px;
//   left: ${(props) => (props.$width || 150) + "px"};
//   right: 0;
//   overflow: hidden;
// `;

const Content = styled.main.attrs<{ $width: number | undefined }>((props) => ({
  style: {
    position: "absolute",
    bottom: "60px",
    top: "60px",
    left: (props.$width || 150) + "px",
    right: 0,
    overflow: "hidden",
  },
}))``;

// const Footer = styled.footer<{ $width: number | undefined }>`
//   position: absolute;
//   bottom: 0;
//   left: ${(props) => (props.$width || 150) + "px"};
//   right: 0;
//   height: 60px;
// `;

const Footer = styled.footer.attrs<{ $width: number | undefined }>((props) => ({
  style: {
    position: "absolute",
    bottom: 0,
    left: (props.$width || 150) + "px",
    right: 0,
    height: "60px",
  },
}))``;

const SideResizer = styled.div`
  z-index: 0;
  position: absolute;
  width: 6px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: orange;
  cursor: col-resize;
`;

const ResizeMask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 99;
  cursor: col-resize;
`;
