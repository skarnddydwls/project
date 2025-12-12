import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

const Comment = () => {
    // const [comments, setComments] = useState([]);
    // const [user, setUser] = useState();

    const user = {
        id: 'newsLover', 
        name: '뉴스러버'
        };

        // 2. 댓글 목록 데이터
    const comments = [
        {
            id: 1,
            author: 'economyKing', // 남이 쓴 댓글
            date: '2025-05-12 14:30',
            content: '이번 경제 정책은 정말 기대가 됩니다. 앞으로의 행보가 주목되네요.',
        },
        {
            id: 2,
            author: 'newsLover',   // ⭐ 내가 쓴 댓글 (삭제 버튼 보여야 함!)
            date: '2025-05-12 15:00',
            content: '좋은 기사 잘 보고 갑니다! 스크랩 해둘게요.',
        },
        {
            id: 3,
            author: 'dailyLife',   // 남이 쓴 댓글
            date: '2025-05-12 16:10',
            content: '내용이 조금 어렵긴 하지만 유익하네요. 2편도 기대하겠습니다.',
        },
        {
            id: 4,
            author: 'newsLover',   // ⭐ 내가 쓴 댓글 (삭제 버튼 보여야 함!)
            date: '2025-05-12 17:45',
            content: '혹시 이 부분에 대한 출처를 알 수 있을까요?',
        },
    ];

    const getComment = async () => {
        const result = await axios.get('');
    }

    useEffect(() => {
        
    },[])

    const handleDelete = (id) => {

    }

    return(
        <div>
            <Card className="p-3 mb-3"> {/* p-3: 안쪽 여백, mb-3: 아래쪽 여백 */}
                <div className="d-flex align-items-center">
                    <textarea 
                        style={{ width: '750px', height: '100px', resize: 'none' }} 
                        // resize: 'none'은 사용자가 크기 조절 못하게 막음
                        className="form-control" // 부트스트랩 스타일 적용 (선택사항)
                    ></textarea>
                    
                    <Button 
                        variant="dark" 
                        style={{ marginLeft: '20px', width: '100px', height: '100px' }} // 높이를 textarea랑 맞추면 예쁨
                    >
                        등록
                    </Button>
                </div>
                <hr/>
                <div className="mt-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="d-flex mb-3">
                    
                    {/* 1. 프로필 (작게) */}
                    <div className="flex-shrink-0 me-2">
                        <div 
                        className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center" 
                        style={{ width: '40px', height: '40px' }}
                        >
                        {comment.author.charAt(0)}
                        </div>
                    </div>

                    {/* 2. 말풍선 본문 (회색 배경) */}
                    <div 
                        className="bg-light p-3 rounded" 
                        style={{ width: '100%', position: 'relative' }}
                    >
                        {/* 이름과 날짜 */}
                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold">{comment.author}</span>
                            <small className="text-muted">{comment.date}</small>
                        </div>
                        
                        {/* 내용 */}
                        <div className="text-break">
                            {comment.content}
                        </div>

                        {/* 삭제 버튼 (우측 하단에 배치) */}
                        {user && user.id === comment.author && (
                            <div className="text-end mt-2">
                                <span 
                                    className="text-secondary" 
                                    style={{ cursor:'pointer', fontSize:'0.8rem' }}
                                    onClick={() => handleDelete(comment.id)}
                                >
                                    삭제 ✖
                                </span>
                            </div>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            </Card>
        </div>
    )
}

export default Comment;