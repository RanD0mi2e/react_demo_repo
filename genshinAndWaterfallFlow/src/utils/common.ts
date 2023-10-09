// 是否是PC端
export function isPCSystem() {
  const userAgentInfo = navigator.userAgent;
  const agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  let flag = true;
  for (let i = 0; i < agents.length; i++) {
    if (userAgentInfo.indexOf(agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

// 节流
export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  // 计时器
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  // 立即执行标识
  let shouldExecute = true;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (shouldExecute) {
      callback.apply(this, args);
      shouldExecute = false;
    }

    if(!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        shouldExecute = true
      }, delay);
    }
  };
}
