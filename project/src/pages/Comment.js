import { useCallback, useEffect, useState } from 'react'; // 1. useState 필수!
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';

function Comment({ articleId }) {
    // ====== State 관리 ======
    const [replyId, setReplyId] = useState(null); // 현재 답글 달고 있는 댓글 ID
    const [replyContent, setReplyContent] = useState(""); // 답글 내용
    const [mainContent, setMainContent] = useState(""); // 메인 댓글 내용이 필요한 가?
    const [comments, setComments] = useState([]); // 댓글 목록
    // const [likeCount, setLikeCount] = useState(); // 좋아요 개수
    // const [likeState, setLikeState] = useState(); // 좋아요 상태

    // 세션에서 유저 정보 가져오기 (JSON 파싱 필요)
    const storedUser = sessionStorage.getItem("loginUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // ====== 댓글 불러오기 ======
    const fetchComment = useCallback(async () => {
        if(!articleId) return;

        try {
            const result = await axios.get(`/api/article/${articleId}/comment`)
            const sortedComments = sortComments(result.data);
            console.log(result.data)
            setComments(sortedComments); // 댓글 넣기
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
            await axios.post(`/api/article/${articleId}/comment`, contentToSend,{
                params: {
                    parent_comment_id: parentId
                },
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8'
                },
            },
            {withCredential: true}); // 쿠키 포함

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
            await axios.delete(`/api/article/${articleId}/comment`, {withCredentials: true})

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

    // 댓글 재정렬 함수 (부모 밑에 자식들 줄 세우기)
    const sortComments = (rawComments) => {
        // 부모 댓글만 골라내기
        const parents = rawComments.filter(c => c.parentCommentId === null);

        // 자식 댓글(답글)만 골라내기
        const replies = rawComments.filter(c => c.parentCommentId !== null);

        let result = [];

        parents.forEach(parent => {
            // 부모를 먼저 넣고
            result.push(parent);

            // 이 부모의 자식들을 찾아서 (ID 기준으로 정렬해서)
            const myKids = replies.filter(r => r.parentCommentId === parent.commentId);
        
            result.push(...myKids);
        });

        return result;
    }

    // ====== 좋아요 함수 ======
    // const handleLikeClick = (commentId) => {
    //     if(!likeState) {
    //         setLikeState(true);
    //         setLikeCount(likeCount+1);
    //         return;
    //     }

    //     if(likeState){
    //         setLikeState(false);
    //         setLikeCount(likeCount-1);
    //         return;
    //     }
    // }

    return (
        <div>
            <Card className="p-3 mb-3">
                {/* 메인 댓글 입력창 */}
                <div className="d-flex align-items-center">
                    <textarea 
                        style={{ width: '750px', height: '100px', resize: 'none' }} 
                        className="form-control"
                        value={mainContent} // value 연결
                        onChange={(e) => setMainContent(e.target.value)} // onChange 연결
                        placeholder={user ? " " : "로그인 후 이용 가능합니다."}
                    ></textarea>
                    <Button 
                        variant="dark" 
                        style={{ marginLeft: '20px', width: '100px', height: '100px' }}
                        onClick={() => handleSend(null)}
                    >
                        등록
                    </Button>
                </div>
                <hr/>
                
                <div className="mt-4">
                {/* comments가 없거나 비었을 때 안전하게 처리 */}
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                    <div key={comment.commentId}> {/* key는 고유 ID 사용 */}
                        <div className={`d-flex mb-3 ${comment.parentCommentId ? 'ms-5' : ''}`}>
                            
                            {/* 답글 화살표 */}
                            {comment.parentCommentId && <div className="me-2 text-muted">↳</div>} 

                            {/* 프로필 이미지 */}
                            <div className="flex-shrink-0 me-2">
                                <div 
                                    className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center" 
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    {/* 작성자 이름의 첫 글자 */}
                                    {comment.userId ? comment.userId.charAt(0) : '?'}
                                </div>
                            </div>

                            {/* 말풍선 본문 */}
                            <div className="bg-light p-3 rounded" style={{ width: '100%', position: 'relative' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <span className="fw-bold me-2">{comment.userId}</span>
                                        <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                                    </div>
                                </div>
                                
                                <div className="text-break">{comment.content}</div>

                                {/* 하단 버튼 영역 */}
                                <div className="text-end mt-2">
                                    <span 
                                        className="text-primary me-3" 
                                        style={{ cursor:'pointer', fontSize:'0.8rem', fontWeight:'bold' }}
                                        onClick={() => toggleReply(comment.commentId)}
                                    >
                                        답글 달기
                                    </span>

                                    {/* 삭제 버튼: 로그인 유저와 작성자가 같을 때만 표시 */}
                                    {user && user.id === comment.userId && (
                                        <span 
                                            className="text-secondary" 
                                            style={{ cursor:'pointer', fontSize:'0.8rem' }}
                                            onClick={() => handleDelete(comment.commentId)}
                                        >
                                            삭제 ✖
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 답글 입력창 */}
                        {replyId === comment.commentId && (
                            <div className="d-flex mb-4 ms-5">
                                <div className="flex-grow-1">
                                    <Form.Control 
                                        as="textarea" 
                                        rows={2} 
                                        placeholder={`@${comment.userId}님에게 답글 작성...`}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="d-flex justify-content-end mt-2">
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => setReplyId(null)}
                                        >
                                            취소
                                        </Button>
                                        {/* 중요: 답글 등록 시 부모 댓글의 ID(commentId)를 넘김 */}
                                        <Button variant="dark" size="sm" onClick={() => handleSend(comment.commentId)}>
                                            답글 등록
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
                ) : (
                    <p className="text-center text-muted">등록된 댓글이 없습니다.</p>
                )}
                </div>
            </Card>
        </div>
    );
}

export default Comment;