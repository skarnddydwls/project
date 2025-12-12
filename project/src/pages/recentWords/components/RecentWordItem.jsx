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
  return (
    <li className="recent-item recent-words-item">
      {/* 단어 헤더 */}
      <div className="recent-word-header-row">
        <span
          className="recent-word-button"
          onClick={() => onClickWord(timestamp)}
        >
          {word}
        </span>

        <button
          type="button"
          className="scrap-delete-btn"
          onClick={() => onDelete(timestamp)}
        >
          <img src={xIcon} alt="삭제" className="scrap-delete-icon" />
        </button>
      </div>

      {/* 요약 말풍선 */}
      {isActive && (
        <div className="recent-word-bubble">
          <p className="recent-word-summary">
            {summary && summary.trim()
              ? summary
              : "저장된 요약이 없습니다."}
          </p>
        </div>
      )}
    </li>
  );
};

export default RecentWordItem;
