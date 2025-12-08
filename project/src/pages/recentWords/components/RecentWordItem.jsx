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
    <div className="recent-item recent-words-item">
    <li>
      <div className="recent-word-header-row">
        <span
          className="recent-word-button"
          onClick={() => onClickWord(word, timestamp)}
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
      
    </li>
    <br />
    
    </div>
  );
};

export default RecentWordItem;
