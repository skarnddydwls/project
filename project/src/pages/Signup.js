                    <Col sm="10">
                    <Form.Control name="phone" onChange={handleChange} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" >
                    <Form.Label column sm="2">ADDRESS</Form.Label>
                    <Col sm="8">
                    <Form.Control name="address" value={form.address} readOnly />
                    </Col>
                    <Col sm="2">
                    <Button onClick={() => setShowPostcode(true)}>주소 검색</Button>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" >
                    <Form.Label column sm="2">DETAIL ADDRESS</Form.Label>
                    <Col sm="10">
                    <Form.Control name="detailAddress" onChange={handleChange}/>
                    </Col>
                </Form.Group>
                <Button type="submit">회원가입</Button>
            </Form>

            <Modal show={showPostcode} onHide={() => setShowPostcode(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>주소 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DaumPostcode onComplete={handleComplete}/>
                </Modal.Body>
            </Modal>
        </div>
    )
}

const style = {
    container : {
        textAlign : 'center',
        marginTop : '40px',
    },
    title : {
        textAlign: 'center',
        marginBottom : '20px'
    },
    form : {
        margin: '0 auto',
        width : '80%'
    }
}

export default Signup;