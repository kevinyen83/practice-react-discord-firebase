import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import callList from './callList';

const Home = () => {
  const [data, setData] = useState(callList);

  const renderCards = () => {
    return data.map((values) => {
      const { id, firstName, lastName, addressLine, city, state, postCode, visitType, transcription } = values;
      return (
        <Col key={id}>
          <CardGroup>
            <Card>
              <Card.Body>
                <Card.Title>{firstName} {lastName}</Card.Title>
                <Card.Text>
                    <div className=''>{transcription}</div>
                </Card.Text>
                <Card.Text><b>Location: {addressLine} {city} {state} {postCode}</b></Card.Text>
                <Card.Text><b>Visit Type: {visitType}</b></Card.Text>
                <Button href='https://cozy-crepe-316d5e.netlify.app/' variant="primary">Answer the phone</Button>
              </Card.Body>
            </Card>
          </CardGroup>
        </Col>
      );
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className='bg_colour_a'>
          <Row>
            <ButtonGroup vertical>
              <Button>Active calls</Button>
              <Button>Pending calls</Button>
              <Button>Missed calls</Button>
            </ButtonGroup>
          </Row>
        </Col>
        <Col className='bg_colour_b'>
            <Row xs={1} md={4} className="g-4">
                {renderCards()}
            </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
