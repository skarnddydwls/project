import { useCallback, useEffect, useState } from 'react'; // 1. useState 필수!
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Comment({ articleId }) {
    // ====== State 관리 ======
    const [replyId, setReplyId] = useState(null); // 현재 답글 달고 있는 댓글 ID
    const [replyContent, setReplyContent] = useState(""); // 답글 내용
    const [mainContent, setMainContent] = useState(""); // 메인 댓글 내용이 필요한 가?
    const [comments, setComments] = useState([]); // 댓글 목록
    const [editId, setEditId] = useState(null);
    const [editContent, setEditContent] = useState("");

    // 세션에서 유저 정보 가져오기 (JSON 파싱 필요)
    const storedUser = sessionStorage.getItem("loginUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // ====== 댓글 불러오기 ======
    const fetchComment = useCallback(async () => {
        if(!articleId) return;

        try {
            const result = await axios.get(`/api/article/${articleId}/comment`)
            const sortedComments = sortComments(result.data);

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
            await axios.delete(`/api/article/${articleId}/comment`, 
                {
                    params: {
                        article_id: articleId,
                        comment_id: commentId
                    }
                },
                {withCredentials: true})
            alert("삭제되었습니다.");
            fetchComment(); // 삭제 후 목록 갱신
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    }

    // ====== 댓글 수정하기 ======
    const handleEditMode = (commentId, currentContent) => {
        setEditId(commentId);
        setEditContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditContent("");
    }

    const handleUpdate = async (commentId) => {
        if(!editContent.trim()) {
            alert("수정할 내용을 입력해주세요.");
            return;
        }

        try {
            await axios.patch(`/api/article/${articleId}/comment`, editContent, 
                {
                    params: {comment_id: commentId, article_id: articleId},
                    headers: {'Content-Type': 'text/plain; charset=utf-8'},
                    withCredentials: true
                }
            );

            alert("수정되었습니다.")
            setEditId(null);
            fetchComment();
        } catch (error) {

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

    const handleToggleLike = () => {

    }

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
                {comments && comments.length > 0 ? (
                    // 1. 부모 댓글만 필터링
                    comments.filter(c => !c.parentCommentId).map((parent) => {
                        
                        // 2. 자식 댓글(대댓글) 찾기
                        const replies = comments.filter(c => c.parentCommentId === parent.commentId);

                        return (
                            <div key={parent.commentId} className="mb-4">
                                
                                {/* 회색 박스 시작 */}
                                <div className="bg-light p-3 rounded shadow-sm" style={{ width: '100%', position: 'relative' }}>
                                    
                                    {/* [A] 부모 댓글 영역 */}
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-2">
                                            <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                                                {parent.userId ? parent.userId.charAt(0) : '?'}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between mb-2">
                                                <div>
                                                    <span className="fw-bold me-2">{parent.userId}</span>
                                                    <small className="text-muted">{new Date(parent.createdAt).toLocaleString()}</small>
                                                </div>
                                            </div>

                                            {/* 부모 본문 (수정 모드 vs 일반 모드) */}
                                            {editId === parent.commentId ? (
                                                <div>
                                                    <Form.Control
                                                        as="textarea" rows={3}
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="mb-2 bg-white"
                                                        style={{ resize: 'none' }}
                                                    />
                                                    <div className="d-flex justify-content-end">
                                                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleCancelEdit}>취소</Button>
                                                        <Button variant="dark" size="sm" onClick={() => handleUpdate(parent.commentId)}>저장</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="text-break">{parent.content}</div>
                                                    
                                                    {/* ⭐️ [수정됨] 부모 버튼 영역 
                                                        - style={{ minHeight: '24px' }} 추가: 버튼이 없어도 이 높이만큼 공간 차지함
                                                    */}
                                                    <div className="d-flex justify-content-end mt-2" style={{ minHeight: '24px' }}>
                                                        <span className="text-primary me-3 fw-bold" style={{ cursor:'pointer', fontSize:'0.8rem' }} onClick={() => toggleReply(parent.commentId)}>답글 달기</span>
                                                        {user && user.id === parent.userId && (
                                                            <>
                                                                <span className="text-secondary" style={{ cursor:'pointer', fontSize:'0.8rem' }} onClick={() => handleEditMode(parent.commentId, parent.content)}>수정</span>
                                                                <span className="text-secondary mx-2" style={{ fontSize: '0.8rem' }}>|</span>
                                                                <span className="text-secondary" style={{ cursor:'pointer', fontSize:'0.8rem' }} onClick={() => handleDelete(parent.commentId)}>삭제</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* [B] 자식 댓글(답글) 목록 영역 */}
                                    {replies.length > 0 && (
                                        <div className="mt-3">
                                            {replies.map(reply => (
                                                <div key={reply.commentId} className="d-flex mt-3 ps-3">
                                                    
                                                    <div className="me-2 text-muted fs-4" style={{ lineHeight: '1' }}>↳</div>
                                                    
                                                    <div className="flex-shrink-0 me-2">
                                                        <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', fontSize:'0.8rem' }}>
                                                            {reply.userId ? reply.userId.charAt(0) : '?'}
                                                        </div>
                                                    </div>

                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <div>
                                                                <span className="fw-bold me-2" style={{fontSize:'0.9rem'}}>{reply.userId}</span>
                                                                <small className="text-muted" style={{fontSize:'0.8rem'}}>{new Date(reply.createdAt).toLocaleString()}</small>
                                                            </div>
                                                        </div>

                                                        {editId === reply.commentId ? (
                                                            <div>
                                                                <Form.Control
                                                                    as="textarea" rows={2}
                                                                    value={editContent}
                                                                    onChange={(e) => setEditContent(e.target.value)}
                                                                    className="mb-2 bg-white"
                                                                    style={{ resize: 'none' }}
                                                                />
                                                                <div className="d-flex justify-content-end">
                                                                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleCancelEdit}>취소</Button>
                                                                    <Button variant="dark" size="sm" onClick={() => handleUpdate(reply.commentId)}>저장</Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="text-break small">{reply.content}</div>
                                                                
                                                                {/* ⭐️ [수정됨] 자식 버튼 영역 
                                                                - 기존에는 조건문 안에 div가 있었으나, 
                                                                - div를 밖으로 꺼내고 minHeight를 줘서 항상 공간을 차지하게 함
                                                                */}
                                                                <div className="d-flex justify-content-end mt-1" style={{ minHeight: '20px' }}>
                                                                    {user && user.id === reply.userId && (
                                                                        <>
                                                                            <span className="text-secondary" style={{ cursor:'pointer', fontSize:'0.7rem' }} onClick={() => handleEditMode(reply.commentId, reply.content)}>수정</span>
                                                                            <span className="text-secondary mx-1" style={{ fontSize: '0.7rem' }}>|</span>
                                                                            <span className="text-secondary" style={{ cursor:'pointer', fontSize:'0.7rem' }} onClick={() => handleDelete(reply.commentId)}>삭제</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* [C] 답글 입력창 영역 */}
                                    {replyId === parent.commentId && (
                                        <div className="mt-3">
                                            <Form.Control 
                                                as="textarea" rows={2} 
                                                placeholder={`@${parent.userId}님에게 답글 작성`} 
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                style={{ resize: 'none', backgroundColor: '#fff' }}
                                            />
                                            <div className="d-flex justify-content-end mt-2">
                                                <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => setReplyId(null)}>취소</Button>
                                                <Button variant="dark" size="sm" onClick={() => handleSend(parent.commentId)}>답글 등록</Button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-muted">등록된 댓글이 없습니다.</p>
                )}
            </div>
            </Card>
        </div>
    );
}

export default Comment;