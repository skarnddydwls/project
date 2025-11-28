import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const Search = ({content}) => {
    // 드래그 관련
    const [selectedText, setSelectedText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({x:0, y:0});
    const [showTooltip, setShowTooltip] = useState(false);

    // 모달 관련
    const [showModal, setShowModal] = useState(false);

    // 마우스 드래그가 끝났을 때 실행되는 함수
    const handleMouseUp = () => {
        if (showModal) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        if(text.length > 0) {
            // 드래그한 위치 계산
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // 툴팁 위치 잡아주기 (화면 스크롤 고려)
            setTooltipPosition({
                x: rect.left + rect.width / 2, // 가로 중앙
                y: rect.top + window.scrollY - 10 // 글자 바로 위
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
            <p>여기에 단어 뜻이나 검색 결과를 보여줍니다.</p>
            <div className="d-grid gap-2">
                <Button 
                    variant="outline-primary" 
                    href={`https://search.naver.com/search.naver?query=${selectedText}`} // 검색은 여기 수정하면 될 거 같고
                    target="_blank"
                >
                    네이버 검색 바로가기
                </Button>
            </div>
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