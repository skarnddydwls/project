import { useCallback } from 'react';
import axios from 'axios';

/**
 * articleId: 어떤 기사에서 발생한 선택인지 (URL의 id 같은 것)
 * sourceType: 'summary' | 'simplified' 처럼 어디서 드래그했는지 표시용
 */
const Sender = (articleId, sourceType) => {
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    // 1) 드래그한 단어
    const selectedWord = selection.toString().trim();

    // 2) 단어가 포함된 문장 찾기
    const node = selection.anchorNode;
    if (!node) return;

    // wholeText가 더 정확, 없으면 textContent 사용
    const text = node.wholeText || node.textContent;
    if (!text) return;

    const index = text.indexOf(selectedWord);
    if (index === -1) return;

    const before = text.slice(0, index);
    const after = text.slice(index + selectedWord.length);

    // 왼쪽 경계(., !, ?, 줄바꿈 기준)
    const leftBoundary = Math.max(
      before.lastIndexOf('.'),
      before.lastIndexOf('!'),
      before.lastIndexOf('?'),
      before.lastIndexOf('\n')
    );

    // 오른쪽 경계
    const rightMatch = after.match(/[\.\!\?\n]/);
    const rightBoundary =
      rightMatch === null
        ? text.length
        : index + selectedWord.length + rightMatch.index;

    const fullSentence = text.slice(leftBoundary + 1, rightBoundary).trim();

    // 3) 백엔드로 보내기 (엔드포인트는 백엔드에서 정한 걸로 바꿔도 됨)
    axios
      .post('/api/word/interpret', {
        articleId,      // 기사 id
        sourceType,     // 'summary' or 'simplified' 등
        word: selectedWord,
        sentence: fullSentence,
      })
      .then((res) => {
        console.log('단어 해석 요청 성공:', res.data);
        // 여기서 해석 결과를 상태에 저장해서 말풍선 띄우고 싶으면
        // 훅을 확장해서 반환값에 포함시키면 됨.
      })
      .catch((err) => {
        console.error('단어 해석 요청 실패:', err);
      });
  }, [articleId, sourceType]);

  // 컴포넌트에서는 이 함수만 onMouseUp에 달아서 쓰면 됨
  return { handleMouseUp };
};

export default Sender;
