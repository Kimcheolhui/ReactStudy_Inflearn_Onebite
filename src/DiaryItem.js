import React, { useContext, useState, useRef } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryItem = ({ id, author, content, created_date, emotion }) => {
  // provider를 사용하여 상태변화 함수를 불러온다
  const { onRemove, onEdit } = useContext(DiaryDispatchContext);

  // 편집 중이 아닐 경우 false, 편집 중일 경우 true
  const [isEdit, setIsEdit] = useState(false);
  // isEdit의 값을 false에서 true로, true에서 false로 변화시킨다
  const toggleIsEdit = () => setIsEdit(!isEdit);

  // 편집 중인 component의 임시 content 값을 가진다
  const [localContent, setLocalContent] = useState(content);
  const localContentInput = useRef();

  const handleRemove = () => {
    if (window.confirm(`${id}번째 일기를 삭제하시겠습니까?`)) {
      onRemove(id);
    }
  };

  // 편집을 하다 취소할 경우,
  // isEdit을 false로 변경하고, 임시 content 값을 기존 content값으로 변경한다
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  // 편집한 일기를 저장
  // 조건에 부합한지 확인한다.
  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }
    // 조건에 부합한다면, 편집에 사용한 임시 content 값을 실제 content 값에 대입한다
    if (window.confirm(`${id}번째 일기를 수정하겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자 : {author} | 감정지수 : {emotion}
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={e => {
                setLocalContent(e.target.value);
              }}></textarea>
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
