import styles from "../../styles/scss/waterfallsFlow.module.scss";
import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  RefObject,
} from "react";
import kurz1 from "p/images/kurz3.png";
import kurz2 from "p/images/kurz4.png";
import kurz12 from "p/images/kurz12.png";

interface WaterfallsFlowItemProps {
  showBorder: number; // 展示边界
  src: string; // 图片链接
  title: string; // 标题
  style: React.CSSProperties; // css样式表
  unitWidth: number; // 宽度
  index: number; // 索引
  sizeChange: (height: number, index: number) => void; // 大小改变回调
}

// 瀑布流图片
export const WaterfallsFlowItem: React.FC<WaterfallsFlowItemProps> = (
  props
) => {
  let {
    showBorder,
    src,
    title,
    style = {},
    unitWidth,
    index,
    sizeChange = () => {},
  } = props;

  let frameDom = useRef(null);
  // 加载标识
  const [isLoading, setIsLoading] = useState(false);
  // 图片信息
  const [imgInfo, setImgInfo] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  });
  let imgDom = useRef<any>(null);

  // 离父容器上边框的距离
  const top = useMemo(() => {
    // 获取y坐标，去除掉px后缀
    let y = style.transform
      ? Number(
          style.transform?.substring(
            style.transform.indexOf(",", 0) + 1,
            style.transform.length - 3
          )
        )
      : undefined;
    return y;
  }, [style.transform]);

  // 是否加载图片
  const isImgShow = useMemo(() => {
    if (top === undefined) {
      return false;
    }
    if (top <= showBorder) {
      return true;
    } else {
      return false;
    }
  }, [top, showBorder]);

  // 图片是否是懒加载
  useEffect(() => {
    if (imgDom.current === null || src === "" || isImgShow === false) return;
    let img = new Image();
    img.src = src;
    img.onload = () => {
      setImgInfo({
        width: img.width,
        height: img.height,
      });
      setIsLoading(true);
    };
    imgDom.current.src = src;
  }, [src, isImgShow]);

  useEffect(() => {
    // 根据宽度比例获取高度
    let height = imgInfo.height * (unitWidth / imgInfo.width);
    // +40，此处的40为图片下方文字高度，可以根据实际需要调整
    if (isLoading) sizeChange(height + 40, index);
  }, [imgInfo, index, isLoading, unitWidth, sizeChange]);

  return (
    <div className={styles.WaterfallItem} style={{ ...style }} ref={frameDom}>
      <div className={styles.WaterfallItem__img}>
        <img
          ref={imgDom}
          style={{ visibility: isLoading ? "visible" : "hidden" }}
        />
      </div>
      <div className={styles.WaterfallItem__name}>
        {title && title}
        {!isLoading && (
          <div className={styles["WaterfallItem__name--placeholder"]}></div>
        )}
      </div>
    </div>
  );
};

// 瀑布流父容器
export const WaterfallFlow = () => {
  // 滚动的父元素
  const scrollParent: RefObject<HTMLDivElement> = useRef(null);

  // 向上滚动距离
  const [scrollTop, setScrollTop] = useState(0);

  // 列表数据
  const [list, setList] = useState<WaterfallsFlowItemProps[]>([]);
  const waterfallFlowDom = useRef(null);

  // 瀑布流容器列表位置信息
  let waterfallFlowListInfo = useRef<
    {
      left: number;
      top: number;
      height: number;
    }[]
  >([]);

  // 当前容器信息
  let [frameInfo, setFrameInfo] = useState<{ width: number }>({ width: 0 });

  // 每行元素个数
  let rowsNum = useMemo(() => {
    let width = frameInfo.width || 0;
    if (width >= 1200) {
      return 6;
    } else if (width >= 768 && width < 1200) {
      return 4;
    } else {
      return 2;
    }
  }, [frameInfo.width]);

  // 每个元素宽度
  let unitWidth = useMemo(() => {
    // 每个元素宽度 = (屏幕宽 - （元素个数 - 1） * 元素间距) / 元素个数
    return (frameInfo.width - (rowsNum - 1) * 10) / rowsNum;
  }, [rowsNum, frameInfo.width]);

  // 样式列表
  const [styleList, setStyleList] = useState<React.CSSProperties[]>([]);

  /** 自定义骨架屏高度*/
  let heightList = [170, 230, 300];

  /** 到达底部*/
  let isLoadingData = useRef(false);

  // 获取位置
  const getStyleList = useCallback(() => {
    let temporaryStyleList: React.CSSProperties[] = styleList;

    // 最底层行元素索引列表
    let bottomItemIndex = [];

    for (let i = 0; i < list.length; i++) {
      // 等高状态下对应的行数
      let currentRow = Math.floor(i / rowsNum);
      // 余数
      let remainder = (i % rowsNum) + 1;

      // 最低高度下标
      let minHeightInd = 0;
      // 最低高度
      let minHeight = 99999999;

      // 寻找最低高度下标
      if (currentRow === 0) {
        bottomItemIndex[i] = i;
      } else {
        for (let j = 0; j < bottomItemIndex.length; j++) {
          if (
            waterfallFlowListInfo.current[bottomItemIndex[j]].top +
              waterfallFlowListInfo.current[bottomItemIndex[j]].height <
            minHeight
          ) {
            minHeightInd = j;
            minHeight =
              waterfallFlowListInfo.current[bottomItemIndex[j]].top +
              waterfallFlowListInfo.current[bottomItemIndex[j]].height;
          }
        }
        bottomItemIndex[minHeightInd] = i;
      }

      if (waterfallFlowListInfo.current[i] === undefined) {
        waterfallFlowListInfo.current[i] = {} as any;
      }

      // 第一行一定从左往右排序
      if (currentRow === 0) {
        if (remainder === 1) {
          waterfallFlowListInfo.current[i].left = 0;
        } else {
          waterfallFlowListInfo.current[i].left =
            waterfallFlowListInfo.current[i - 1].left + 10 + unitWidth;
        }
        waterfallFlowListInfo.current[i].top = 0;
      } else {
        // 剩余元素铺设在最低高度下
        waterfallFlowListInfo.current[i].left =
          waterfallFlowListInfo.current[minHeightInd].left;
        waterfallFlowListInfo.current[i].top = minHeight + 25;
      }

      // 有高度使用给定高度，否则随机使用骨架屏默认高度
      waterfallFlowListInfo.current[i].height =
        waterfallFlowListInfo.current[i].height ||
        heightList[createRandomNum(0, 2)];

      temporaryStyleList[i] = {
        transform: `translate(${waterfallFlowListInfo.current[i].left}px,${waterfallFlowListInfo.current[i].top}px)`,
        width: `${unitWidth}px`,
        height: waterfallFlowListInfo.current[i].height,
      };
    }

    return [...temporaryStyleList];
  }, [unitWidth, rowsNum, list]);

  // 图片加载完更新高度
  const onSizeChange = useCallback(
    (height: number, index: number) => {
      if (waterfallFlowListInfo.current[index].height === undefined) {
        waterfallFlowListInfo.current[index] = {} as any;
      }
      waterfallFlowListInfo.current[index].height = height;
      setStyleList(getStyleList());
    },
    [getStyleList]
  );

  // 生成随机数
  const createRandomNum = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }, []);

  // 图片列表大小、数量发生变化时
  useEffect(() => {
    setStyleList(getStyleList());
  }, [getStyleList]);

  // 初始化请求数据
  useEffect(() => {
    isLoadingData.current = true;
    let data: any = [];

    // 默认填充数据用于展示骨架屏
    for (let i = 0; i < 50; i++) {
      data.push({
        src: "",
        title: "",
      });
    }

    // 更新list
    setList(data);

    // 清空临时数据
    data = [];

    for (let i = 0; i < 50; i++) {
      let item;
      if (i % 3 == 0) {
        item = {
          src: kurz1.src,
          title: `第${i}个item`,
        };
      }
      if (i % 3 == 1) {
        item = {
          src: kurz2.src,
          title: `第${i}个item`,
        };
      }
      if (i % 3 == 2) {
        item = {
          src: kurz12.src,
          title: `第${i}个item`,
        };
      }
      data.push(item);
    }
    // 模拟请求数据
    setTimeout(() => {
      setList(data);
      isLoadingData.current = false;
    }, 1200);
  }, []);

  const onResize = useCallback(() => {
    if (waterfallFlowDom.current === null) return;
    setFrameInfo({
      width: (
        waterfallFlowDom.current as HTMLDivElement
      ).getBoundingClientRect().width,
    });
  }, []);

  // 监听列表容器大小变化
  useEffect(() => {
    if (waterfallFlowDom.current === null) return;
    const resizeObserver = new ResizeObserver((entries) => {
      onResize();
    });
    resizeObserver.observe(waterfallFlowDom.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const onScroll = useCallback(() => {
    // 记录滚动值
    setScrollTop((scrollParent.current as HTMLDivElement).scrollTop);

    let top = scrollParent.current?.scrollTop as number;
    let clientHeight = scrollParent.current?.clientHeight as number;
    let scrollHeight = scrollParent.current?.scrollHeight as number;

    // 底部加载
    if (
      scrollHeight - clientHeight / 3 <= top + clientHeight &&
      isLoadingData.current === false
    ) {
      // 滚动元素剩余的高度的三分之一处时加载新数据
      isLoadingData.current = true;
      let data: any[] = [];

      for (let i = 0; i < 50; i++) {
        let item;
        if (i % 3 == 0) {
          item = {
            src: kurz1.src,
            title: `第${i}个item`,
          };
        }
        if (i % 3 == 1) {
          item = {
            src: kurz2.src,
            title: `第${i}个item`,
          };
        }
        if (i % 3 == 2) {
          item = {
            src: kurz12.src,
            title: `第${i}个item`,
          };
        }
        data.push(item);
      }
      // 模拟请求数据
      setTimeout(() => {
        isLoadingData.current = false;
        setList((lastData) => {
          return [...lastData, ...data];
        });
      }, 1200);
    }
  }, []);

  // 监听滚动
  useEffect(() => {
    scrollParent.current?.addEventListener("scroll", onScroll);

    return () => {
      scrollParent.current?.removeEventListener("scroll", onScroll);
    };
  }, []);

  //#region tsx结构
  return (
    <div className={styles.waterfallFlow} ref={scrollParent}>
      <div className={styles.waterfallFlow__title}>响应式瀑布流</div>
      <section ref={waterfallFlowDom} className={styles.waterfallFlow__content}>
        {list.map((item, ind) => {
          return (
            <div key={ind}>
              <WaterfallsFlowItem
                key={ind}
                showBorder={
                  scrollTop + (scrollParent.current as any).clientHeight
                }
                src={item.src}
                title={item.title}
                style={styleList[ind]}
                sizeChange={onSizeChange}
                index={ind}
                unitWidth={unitWidth}
              />
              {item.title}
            </div>
          );
        })}
      </section>
    </div>
  );
  //#endregion
};
