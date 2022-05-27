import React, { useState, useRef, useContext } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = () => {
  // provider를 사용하여 상태변화 함수를 불러온다
  const { onCreate } = useContext(DiaryDispatchContext);

  // Create 조건이 충족되지 않을 경우 해당 부분에 focus를 주기 위해 사용된다
  const authorInput = useRef();
  const contentInput = useRef();

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  // 사용자가 입력한 값을 실시간으로 반영한다
  // author(또는 content)를 수정할 경우, content(또는 author)는 그대로 놔두고 (...state)
  // author(또는 content)를 실시간으로 반영 (e.target.name은 author(또는 content)를 지정한다)
  const handleChangeState = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // 조건에 부합하는지 확인 후, onCreate 함수로 state 넘겨서 data에 저장
  // 부합하지 않을 경우, 해당 부분에 focus를 준 후 return
  const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공");
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          ref={authorInput}
          name="author"
          value={state.author}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          ref={contentInput}
          name="content"
          value={state.content}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <i>오늘의 감정지수 : </i>
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleChangeState}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);
