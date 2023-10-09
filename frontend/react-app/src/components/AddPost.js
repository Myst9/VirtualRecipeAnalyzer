import {useState, useContext, useEffect} from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AddPost() {

	const navigate = useNavigate();

	const [userId, setuserId] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	
	console.log(userId);
	console.log(title);
	console.log(description);

	const addPost = (e) => {
		e.preventDefault();
		fetch(`${process.env.REACT_APP_API_URL}/posts/create`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				 Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				userId: userId,
				title: title,
				description: description
			})
		})
		.then(res => {
		    if (res.status === 200) {
		        return res.json(); // Successful response
		    } else {
		        throw new Error(`Server returned ${res.status} status`);
		    }
		})
			.then(data => {

			if(data) {
				Swal.fire({
					title: "Success",
					icon: "success",
					text: "Post has been added successfully"
				})

				navigate("/post")

			} else {
				Swal.fire({
					title: "Something went wrong",
					icon: "error",
					text: "Please try again"
				})
			}

		})
	};

	return (
		<Container>
			<Row>
				<Col lg={{span: 6, offset:3}} >
					<Card>
					      <Card.Body className="text-center">
					      <h1>Add Post</h1>
					      	<Form onSubmit={(e) => addPost(e)}>
		                      <Form.Group className="mb-3" controlId="form.Name">
		                        <Form.Label className="text-center">
		                          User
		                        </Form.Label>
		                          <Form.Control
		                            type="text"
		                            placeholder="userId"
		                            onChange={(e) => setuserId(e.target.value)}
		                            value={userId}
		                            required
		                          />
		                      </Form.Group>
  		                    <Form.Group className="mb-3">
		                        <Form.Label className="text-center" controlId="form.Title">
		                          Title
		                        </Form.Label>
		                          <Form.Control
		                            type="text"
		                            placeholder="Title"
		                            onChange={(e) => setTitle(e.target.value)}
		                            value={title}
		                            required
		                          />
		                      </Form.Group>
		                      <Form.Group className="mb-3" controlId="form.Textarea">
		                        <Form.Label className="text-center">
		                          Description
		                        </Form.Label>
		                          <Form.Control
		                            as="textarea" rows={3}
		                            placeholder="Description"
		                            onChange={(e) => setDescription(e.target.value)}
		                            value={description}
		                            required
		                          />
		                      </Form.Group>
                              <Button variant="primary" type="submit">
                                Add Post
                              </Button>
		                    </Form>
					      </Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
