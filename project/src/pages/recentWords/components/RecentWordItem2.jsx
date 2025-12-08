import "../../../css/RecentWords.css";
import xIcon from "../../../img/x-icon.svg"; // 수정됨

const RecentWordItem2 = ({
  summary,
  isActive,
}) => {
  return (
    <div className="recent-item recent-words-item">
    {isActive && (
        <div className="recent-word-bubble"> {/* 수정됨 */}
          <p className="recent-word-summary">
            <strong>요약:</strong>{" "}
            {summary && summary.trim()
              ? summary
              : "저장된 요약이 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentWordItem2;