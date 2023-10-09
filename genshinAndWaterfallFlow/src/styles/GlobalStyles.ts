import { createGlobalStyle } from "styled-components";

// 全局样式
export const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden; /* 防止滚动条出现 */
    }
`;
