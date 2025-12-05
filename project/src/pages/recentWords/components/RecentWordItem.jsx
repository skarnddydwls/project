import xIcon from "../../../img/x-icon.svg"; // 경로는 프로젝트 구조에 맞게 필요하면 수정

const RecentWordItem = ({
  word,
  timestamp,
  isActive,
  isLoading,
  summary,
  error,
  onClickWord,
  onDelete,
}) => {
  const handleClickWord = () => {
    onClickWord(word, timestamp);
  };

  const handleClickDelete = (e) => {
    e.stopPropagation();
    onDelete(timestamp);
  };

  return (
    <li className="recent-words-item">
      {/* 윗줄: 단어 + X 버튼 */}
      <div className="recent-words-row">
        <span
          className="recent-words-word"
          onClick={handleClickWord}
          title={word}
        >
          {word}
        </span>

        <button className="scrap-delete-btn" onClick={handleClickDelete}>
          <img src={xIcon} alt="삭제" className="scrap-delete-icon" />
        </button>
      </div>

      {/* 아랫줄: 말풍선 */}
      {isActive && (
        <div className="recent-words-bubble">
          {isLoading && (
            <p className="recent-words-loading">뜻을 불러오는 중...</p>
          )}

          {!isLoading && error && (
            <p className="recent-words-error">{error}</p>
          )}

          {!isLoading && !error && summary && (
            <p className="recent-words-summary">
              <strong>뜻:</strong> {summary}
            </p>
          )}

          {!isLoading && !error && !summary && (
            <p className="recent-words-loading">
              아직 불러온 뜻이 없습니다.
            </p>
          )}
        </div>
      )}
    </li>
  );
};

export default RecentWordItem;
