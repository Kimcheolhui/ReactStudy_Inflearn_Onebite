import { useContext } from "react";
import { DiaryStateContext } from "./App";
import DiaryItem from "./DiaryItem";

const DiaryList = () => {
  // provider를 사용하여 data set을 불러와 diaryList에 저장한다
  const diaryList = useContext(DiaryStateContext);
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {/* diaryList의 요소를 하나씩 DiaryItem component에 전달한다 */}
        {diaryList.map(it => (
          <DiaryItem key={it.id} {...it} />
        ))}
      </div>
    </div>
  );
};

// DiaryList가 없을 경우 빈 배열을 할당해준다
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
