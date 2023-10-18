import styled from "styled-components";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";

export const ChatRoom = () => {
  interface Props {
    key?: number;
    type: "me" | "people" | "system";
    data: string;
    ip?: number | string;
  }

  const [list, setList] = useState<Props[]>([]);
  const [content, setContent] = useState("");
  const [connectTitle, setConnectTitle] = useState("连接聊天室");
  const [identifier, setIdentifier] = useState("");
  let ws = useRef<WebSocket | null>(null);

  function sendMsg(obj: any) {
    const sendMsg = JSON.stringify(obj);
    if (ws) {
      ws.current?.send(sendMsg);
    }
  }

  function handleList(list: Props[], obj: Props) {
    const newList = [
      ...list,
      {
        key: list.length,
        ...obj,
      },
    ];
    return newList;
  }

  const onmessageFC = useCallback((msg:MessageEvent<any>) => {
    const message = JSON.parse(msg.data);
    if (message.type === "init") {
      setIdentifier(message.identifier);
    } else {
      setList(
        handleList(
          list,
          Object.assign({}, message, {
            type: message.identifier === identifier ? "me" : "people",
          })
        )
      );
    }
  }, [identifier, list])

  function handleConnection() {
    if (ws.current == null) {
      ws.current = new WebSocket("ws://10.11.229.68:3001/ws");
      ws.current.onopen = () => {
        setConnectTitle("断开聊天室");
        setList(handleList(list, { type: "system", data: "加入聊天室" }));
      };
      ws.current.onmessage = onmessageFC;
      ws.current.onclose = (evt) => {
        setList(
          handleList(list, {
            type: "system",
            data: "聊天室关闭",
          })
        );
      };
      ws.current.onerror = (evt) => {
        setList(
          handleList(list, {
            type: "system",
            data: "连接失败",
          })
        );
      };
    } else {
      setConnectTitle("加入聊天室");
      ws.current.close();
      ws.current = null;
    }
  }

  function handleContentText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
  }

  function handleSend() {
    if (!content) return;
    sendMsg({
      identifier,
      data: content,
    });
  }

  return (
    <ChatRoomMain>
      <ConfigWrapper>
        <ConnectBtn id="connectBtn" onClick={handleConnection}>
          {connectTitle}
        </ConnectBtn>
      </ConfigWrapper>
      <ChatWrapper>
        <ChatContent id="messageBox">
          {list.map((item, index) => {
            if (item.type === "me")
              return (
                <div key={index} className="right">
                  <span>我</span>
                  <p className="bubble">{item.data}</p>
                </div>
              );
            if (item.type === "people") {
              return (
                <div key={index} className="left">
                  <span>{item.ip}</span>
                  <p className="bubble">{item.data}</p>
                </div>
              );
            }
            if (item.type === "system") {
              return (
                <div key={index} className="center">
                  {item.data}
                </div>
              );
            }
          })}
        </ChatContent>
        <OperationBox>
          <SendContent id="chat" value={content} onChange={handleContentText} />
          <SendButton id="sendBtn" onClick={handleSend}>
            发送
          </SendButton>
        </OperationBox>
      </ChatWrapper>
    </ChatRoomMain>
  );
};

const ChatRoomMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 20px;
`;

const ConfigWrapper = styled.div`
  /* width: 200px; */
  padding: 10px;
`;

const ConnectBtn = styled.button`
  height: 25px;
`;

const ChatWrapper = styled.div`
  width: calc(100% - 40px);
  padding: 10px;
`;

const ChatContent = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: calc(100vh - 300px);
  margin: 20px 0;
  border-radius: 10px;
  border: 1px solid #ccc;
  overflow-y: auto;

  .center {
    text-align: center;
    font-size: 12px;
    color: #666;
  }

  .left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .left .bubble {
    margin-bottom: 10px;
    border-radius: 20px;
    padding: 10px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    color: #333;
  }
  .left span {
    margin-left: 10px;
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .right .bubble {
    margin-bottom: 10px;
    border-radius: 20px;
    padding: 10px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #def1fc;
    color: #333;
  }

  .right span {
    margin-right: 10px;
  }

  .operation {
    position: relative;
  }

  div {
    width: 100%;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;

    span {
      font-size: 12px;
    }

    p {
      margin: 0;
    }
  }
`;

const OperationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 20px;
`;

const SendContent = styled.textarea`
  width: 300px;
  height: 60px;
  margin-right: 20px;
  resize: none;
`;

const SendButton = styled.button`
  width: 80px;
  max-height: 40px;
`;
