import { useRef } from "react";
import { useClickAway } from "react-use";
import "../../../css/RecentWords.css";
import xIcon from "../../../img/x-icon.svg";

const RecentWordItem = ({
  word,
  summary,
  timestamp,
  isActive,
  onClickWord,
  onDelete,
}) => {
  // ✅ 이 아이템(말풍선 포함) 영역 밖 클릭하면 닫기
  const itemRef = useRef(null);

  useClickAway(itemRef, () => {
    // 열려 있을 때만 닫기 실행(불필요 토글 방지)
    if (isActive) {
      onClickWord(timestamp); // 기존 토글 함수를 재사용해서 닫음
    }
  });

  return (
    <li ref={itemRef} className="recent-item recent-words-item">
      {/* 단어 헤더 */}
      <div className="recent-word-header-row">
        <span
          className="recent-word-button"
          onClick={() => onClickWord(timestamp)}
        >
          {word}
        </span>

        <button type="button" className="scrap-delete-btn" onClick={() => onDelete(timestamp)}>
  <img src={xIcon} alt="삭제" className="scrap-delete-icon" />
</button>
      </div>

      {/* 요약 말풍선 */}
      {isActive && (
        <div className="recent-word-bubble">
          <p className="recent-word-summary">
            {summary && summary.trim() ? summary : "저장된 요약이 없습니다."}
          </p>
        </div>
      )}
    </li>
  );
};

export default RecentWordItem;
