"use client";

import { DeviceProvider } from "@/Context/deviceContext";
import { GenshinRoleSwitch } from "@/pages/GenshinRoleSwitch/GenshinRoleSwitch";
import { styled } from "styled-components";
import { GlobalStyle } from "@/styles/GlobalStyles";
import { WaterfallsFlowItem } from "@/pages/WaterfallsFlow";
import { WaterfallFlow } from "@/pages/WaterfallsFlow";
import React from "react";
import { Layout, ResizeLayout } from "@/layout/Layout";

// import { AddTask } from "@/components/Task/AddTask";
// import { TaskList } from "@/components/Task/TaskList";
// import { TasksProvider } from "@/Context/TasksContext";

export default function Home() {
  return (
    <React.StrictMode>
      {/* 全局样式 */}
      <GlobalStyle />
      {/* <TasksProvider>
        <h1>Day off in Kyoto</h1>
        <AddTask></AddTask>
        <TaskList></TaskList>
      </TasksProvider> */}

      {/* 原神轮播图 */}
      {/* <DeviceProvider>
        <GenshinRoleSwitch />
      </DeviceProvider> */}

      {/* 小红书瀑布流 */}
      {/* <div
        style={{
          display: "flex",
        }}
      >
        <div>左侧导航栏</div>
        <WaterfallFlow />
      </div> */}

      {/* 页面布局 */}
      <ResizeLayout>
        <div
          style={{
            display: "flex",
          }}
        >
          <div>左侧导航栏</div>
          <WaterfallFlow />
        </div>
      </ResizeLayout>
    </React.StrictMode>
  );
}
