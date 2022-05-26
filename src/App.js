import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import "./App.css";

// 상태관리 함수를 reducer를 활용하여 간단하게 정리
// App component의 복잡성을 줄임
// 각각의 case는 return 값을 가지는데, 해당 값이 state의 새로운 값이 된다
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter(it => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map(it =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

// provider를 사용하기 위한 context 설정
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const App = () => {
  // useReducer를 사용하기 위한 선언
  // data는 state, dispatch는 data 상태 변경을 일으키기 위한 함수
  // reducer는 상태 변경의 상세한 내용을 가진 함수이다.
  // reducer가 return하는 값이 state의 새로운 값이 된다.
  const [data, dispatch] = useReducer(reducer, []);

  // useRef를 사용하는 이유
  // useRef는 rerendering을 발생시키지 않기 때문
  // 만약 const dataId = 0;을 사용했다면
  // dataId++가 될 때마다 rerendering이 발생했을 것
  const dataId = useRef(0);

  const getData = async () => {
    // api를 활용하여 데이터 불러오기
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then(res => res.json());

    // 배열.slice(n,m)은 특정 구간만 가져오는 배열함수
    const initData = res.slice(0, 20).map(it => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    // type과 data는 action 객체의 key
    dispatch({ type: "INIT", data: initData });
  };

  // deps로 빈 배열을 주면 컴포넌트가 처음 render되었을 때만 실행하게 된다
  useEffect(() => {
    getData();
  }, []);

  // React에서 state가 변경되면 rerender가 되면서 각 요소들에 state가 업데이트가 되어야 하는데
  // useCallback의 deps에 빈 배열을 사용하게 되면, rerender가 절대 일어나지 않기 때문에 onCreate 함수에 대한 state 변경이 이뤄지지 않는다
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        author,
        content,
        emotion,
        id: dataId.current,
      },
    });
    dataId.current += 1;
  }, []);

  const onRemove = useCallback(targetId => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

  // memoizedDispatches객체의 재생성을 방지하기 위해
  // useMemo를 사용
  // memoizedDispatches를 useMemo없이 정의하게 되면,
  // <DiaryStateContext.Provider value={data}>가 rerender될 때
  // memoizedDispatches도 rerender되기 때문에 이를 방지하고자 useMemo를 사용한다
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  // 데이터의 길이가 바뀔 때만 rerender가 발생한다
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter(it => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;
