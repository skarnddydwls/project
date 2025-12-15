import { useCallback, useEffect, useState } from 'react'; // 1. useState 필수!
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';

function Comment({ articleId }) {
    // ====== State 관리 ======
    const [replyId, setReplyId] = useState(null); // 현재 답글 달고 있는 댓글 ID
    const [replyContent, setReplyContent] = useState(""); // 답글 내용
    const [mainContent, setMainContent] = useState(""); // 메인 댓글 내용이 필요한 가?
    const [comments, setComments] = useState([]);
    const user = sessionStorage.getItem("loginUser");

    // ====== 댓글 불러오기 ======
    const fetchComment = useCallback(async () => {
        try {
            const result = await axios.get('');
            setComments(); // 댓글 넣기
        } catch (error) {
            console.log(`오류: ${error}`);
        }
    }, [articleId]);

    useEffect(()=>{
        fetchComment();
    }, [fetchComment]);

    // ====== 댓글/답글 입력하기 ======
    const handleSend = async (parentId = null) => {
        if (!user) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        const contentToSend = parentId ? replyContent : mainContent;
        if(!contentToSend.trim()){
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            await axios.post('/api/comment', {

            }, {withCredential: true}); // 쿠기 포함

            alert("댓글이 등록되었습니다.");
            if (parentId) {
                setReplyId(null);
                setReplyContent("");
            } else {
                setMainContent("");
            }
            fetchComment(); 
        }
        catch(error) {

        }
    }

    // ====== 댓글 삭제하기 ======
    const handleDelete = async (commentId) => {
        if(!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(``, {withCredentials: true})
            alert("삭제되었습니다.");
            fetchComment(); // 삭제 후 목록 갱신
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    }

    // 답글 창 토글 함수
    const toggleReply = (id) => {
        if (replyId === id) {
            setReplyId(null); // 이미 열려있으면 닫기
        } else {
            setReplyId(id);   // 해당 댓글의 답글창 열기
            setReplyContent(""); // 내용 초기화
        }
    };

    comments = [
        { id: 1, author: 'user1', content: '첫 번째 댓글입니다.', date: '...', parentId: null },
        { id: 2, author: 'user2', content: '첫 번째 댓글의 답글입니다!', date: '...', parentId: 1 }, // 답글
        { id: 3, author: 'user3', content: '독자적인 댓글입니다.', date: '...', parentId: null },
    ];

    return (
        <div>
            <Card className="p-3 mb-3">
                {/* 메인 댓글 입력창 */}
                <div className="d-flex align-items-center">
                    <textarea 
                        style={{ width: '750px', height: '100px', resize: 'none' }} 
                        className="form-control"
                    ></textarea>
                    <Button 
                        variant="dark" 
                        style={{ marginLeft: '20px', width: '100px', height: '100px' }}
                    >
                        등록
                    </Button>
                </div>
                <hr/>
                
                <div className="mt-4">
                {comments?.map((comment) => (
                    <div key={comment.id}>
                        {/* ====================================================
                           3. 댓글 아이템 (parentId가 있으면 오른쪽으로 밀기) 
                           ==================================================== */}
                        <div className={`d-flex mb-3 ${comment.parentId ? 'ms-5' : ''}`}>
                            
                            {/* 답글이면 화살표 아이콘 보여주기 (선택사항) */}
                            {comment.parentId && <div className="me-2 text-muted">↳</div>}

                            {/* 프로필 이미지 */}
                            <div className="flex-shrink-0 me-2">
                                <div 
                                    className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center" 
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    {comment.author.charAt(0)}
                                </div>
                            </div>

                            {/* 말풍선 본문 */}
                            <div className="bg-light p-3 rounded" style={{ width: '100%', position: 'relative' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <span className="fw-bold me-2">{comment.author}</span>
                                        <small className="text-muted">{comment.date}</small>
                                    </div>
                                </div>
                                
                                <div className="text-break">{comment.content}</div>

                                {/* 하단 버튼 영역 (답글 / 삭제) */}
                                <div className="text-end mt-2">
                                    {/* 4. 답글 달기 버튼 추가 */}
                                    <span 
                                        className="text-primary me-3" 
                                        style={{ cursor:'pointer', fontSize:'0.8rem', fontWeight:'bold' }}
                                        onClick={() => toggleReply(comment.id)}
                                    >
                                        답글 달기
                                    </span>

                                    {/* 삭제 버튼 (본인일 때만) */}
                                    {user && user.id === comment.author && (
                                        <span 
                                            className="text-secondary" 
                                            style={{ cursor:'pointer', fontSize:'0.8rem' }}
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            삭제 ✖
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ====================================================
                           5. 답글 입력창 (조건부 렌더링)
                           replyId가 현재 댓글 ID와 같을 때만 나타남
                           ==================================================== */}
                        {replyId === comment.id && (
                            <div className="d-flex mb-4 ms-5"> {/* 답글 입력창도 들여쓰기 */}
                                <div className="flex-grow-1">
                                    <Form.Control 
                                        as="textarea" 
                                        rows={2} 
                                        placeholder={`@${comment.author}님에게 답글 작성...`}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="d-flex justify-content-end mt-2">
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => setReplyId(null)} // 취소 버튼
                                        >
                                            취소
                                        </Button>
                                        <Button variant="dark" size="sm" onClick={() => handleSend(comment.id)}>
                                            답글 등록
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </Card>
        </div>
    );
}

export default Comment;