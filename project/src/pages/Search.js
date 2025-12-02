import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const Search = ({content}) => {
    // 드래그 관련
    const [selectedText, setSelectedText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({x:0, y:0});
    const [showTooltip, setShowTooltip] = useState(false);
    const [contextSentence, setContextSentence] = useState('');

    // 모달 관련
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);       // 로딩 중인지?
    const [searchResult, setSearchResult] = useState(null); // 검색 결과 데이터

    // 마우스 드래그가 끝났을 때 실행되는 함수
    const handleMouseUp = () => {
        if (showModal) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        

        if(text.length > 0) {
            // 1. 전체 텍스트 가져오기 (anchorNode는 드래그 시작한 텍스트 노드)
            // 주의: <p>태그 안에 텍스트가 있어야 합니다.
            const fullText = selection.anchorNode.textContent;

            // 드래그한 위치 계산
            const range = selection.getRangeAt(0);
            const startIndex = range.startOffset;
            const endIndex = range.endOffset;

            // 3. 앞쪽으로 가면서 문장 시작점(마침표) 찾기
            let sentenceStart = 0;
            // 시작점부터 0까지 거꾸로 돕니다.
            for (let i = startIndex; i >= 0; i--) {
                // 마침표(.), 물음표(?), 느낌표(!)가 나오면 그 다음 글자가 시작점입니다.
                if (['.', '?', '!', '\n'].includes(fullText[i])) {
                    sentenceStart = i + 1; 
                    break;
                }
            }

            // 4. 뒤쪽으로 가면서 문장 끝점(마침표) 찾기
            let sentenceEnd = fullText.length;
            // 끝점부터 마지막까지 돕니다.
            for (let i = endIndex; i < fullText.length; i++) {
                if (['.', '?', '!', '\n'].includes(fullText[i])) {
                    sentenceEnd = i + 1; // 마침표까지 포함
                    break;
                }
            }

            // 5. 문장 잘라내기
            const extractedSentence = fullText.substring(sentenceStart, sentenceEnd).trim();
            
            // State에 저장
            setContextSentence(extractedSentence);

            // 툴팁 위치 잡아주기 (화면 스크롤 고려)
            const rect = range.getBoundingClientRect();
            setTooltipPosition({
                x: rect.left + rect.width / 2, // 가로 중앙
                y: rect.top - 10 // 글자 바로 위
            });
            setSelectedText(text);
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
        }
    };

    // 검색 버튼 클릭 시
    const handleSearchClick = () => {
        setShowTooltip(false);
        setShowModal(true);
        setLoading(true);
        setSearchResult(null);

        axios.get('/api/util/word-meaning', { params : {
            word: selectedText,
            sentence: contextSentence
        }})
        .then((result) => {
            setSearchResult(result.data);
            setLoading(false);
        })
    }   

    return(
        <div onMouseUp={handleMouseUp} style={{position: 'relative'}}> 
            {/* 실제 글자 보여주는 부분 */}
            <p style={{whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '1.1rem'}}>
                {content}
            </p>

            {/* 2. 말풍선 (툴팁) */}
        {showTooltip && (
        <div
          onClick={handleSearchClick}
          onMouseUp={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 9999,
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          검색
          {/* 말풍선 꼬리 */}
          <div style={{
             position: 'absolute',
             top: '100%', left: '50%', marginLeft: '-6px',
             borderWidth: '6px', borderStyle: 'solid',
             borderColor: '#333 transparent transparent transparent'
          }}></div>
        </div>
      )}
        {/* 3. 검색 결과 모달창 */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
            <Modal.Title>'{selectedText}' 검색 결과</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    {loading ? (
                        <div className="text-center py-3">
                            {/* 로딩 중일 때 */}
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">사전을 찾아보는 중입니다...</p>
                        </div>
                    ) : (
                        /* 결과가 있을 때 */
                        searchResult ? (
                            <div>
                                {searchResult.error ? (
                                    <p className="text-danger">{searchResult.description}</p>
                                ) : (
                                    <>
                                        {/* 결과 데이터 구조에 맞게 수정 필요 (title, description 등) */}
                                        <h5>{searchResult.title || selectedText}</h5>
                                        <hr/>
                                        <p style={{ lineHeight: '1.6' }}>
                                            {/* HTML 태그가 있다면 제거해서 보여주기 */}
                                            {searchResult.description?.replace(/<[^>]*>?/g, '')}
                                        </p>
                                        
                                        {/* 링크가 있다면 */}
                                        {searchResult.link && (
                                            <div className="d-grid gap-2 mt-3">
                                                <Button 
                                                    variant="outline-primary" 
                                                    href={searchResult.link} 
                                                    target="_blank"
                                                >
                                                    더 자세히 보기
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <p>검색 결과가 없습니다.</p>
                        )
                    )}
                </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                닫기
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}

export default Search;