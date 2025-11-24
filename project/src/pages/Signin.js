const Signin = () => {
    return(
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="email">
                    <Form.Label column sm="2">Email</Form.Label>
                    <Col sm="6">
                    <Form.Control name="email" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Password">
                    <Form.Label column sm="2">Password</Form.Label>
                    <Col sm="6">
                    <Form.Control type="password" name="password" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Button type="submit">로그인</Button> &emsp;
                <Button type="button" onClick={() => {window.location.href='./signup'}}>회원가입</Button>
            </Form>
        </>
    )
}

export default Signin;