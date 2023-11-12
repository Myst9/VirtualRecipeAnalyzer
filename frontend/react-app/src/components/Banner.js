import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
  const { title, content, destination, label } = data;

  return (
    <Row className="align-items-center justify-content-center" style={{ height: '70vh' }}>
      <Col className="text-center p-5" style={{ color: 'white' }}>
        <h1 style={{ fontSize: '3rem' }}>{title}</h1>
        <h4>{content}</h4>
        <Button
          variant="primary"
          as={Link}
          to={destination}
          style={{ padding: '10px', backgroundColor: '#eb3464' }}
        >
          {label}
        </Button>
      </Col>
    </Row>
  );
}
