import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from 'react';
import { getAllSensorInfo } from '../../apis/apis';
import RealChart from '../Chart/Chart';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

const Layout = () => {
    const [sensors, setSensors] = useState([])

    
    const [modalAddSensorShow, setModalAddSensorShow] = useState(false);
    const [modalChangeDelayShow, setModalChangeDelayShow] = useState(false);
    const [modalEditShow, setModalEditShow] = useState(false);
    const [modalDeleteShow, setModalDeleteShow] = useState(false);

    useEffect(() => {
        getAllSensorInfo().then((data) => {
            console.log(data)
        })
    }, [])

    return (
    <>
    <Button style={{float: "right"}} onClick={() => setModalAddSensorShow(true)}>Add sensor</Button>
    <Button style={{float: "right", marginRight: "15px"}} onClick={() => setModalChangeDelayShow(true)}>Change delay</Button>
    <Form.Check style={{float: "right", marginRight: "40px"}}// prettier-ignore
        type="switch"
        id="custom-switch"
        label="Turn on all sensors"
      />
      <br/>
      <br/>
        <Navbar bg="light" className="mb-3" fixed='top' >
          <Container fluid>
            <Navbar.Brand href="#">Humidity</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-xxl`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-xxl`}
              aria-labelledby={`offcanvasNavbarLabel-expand-xxl`}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xxl`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="#action2">Link</Nav.Link>
                  <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-xxl`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        <Accordion flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Sensor 1</Accordion.Header>
        <Accordion.Body>
            <Button variant='danger' style={{float: "right"}} onClick={() => setModalDeleteShow(true)}>Delete</Button>
            <Button style={{float: "right", marginRight: " 15px"}} onClick={() => setModalEditShow(true)}>Edit</Button>
            <div style={{display: "inline"}}>
          <h4>Information</h4>
            <span >ID: 1</span>
            <br />
            <span>Name: Sensor 1</span><br />
            <span>Delay: 5000 ms</span><br />
            <span>State: On</span><br />
            </div>
            <br />
            <RealChart></RealChart>
            
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Sensor 2</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <Modal
        show={modalAddSensorShow}
        onHide={() => setModalAddSensorShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Sensor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="sensor..."
                autoFocus
              />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setModalAddSensorShow(false)}>Close</Button>
          <Button onClick={() => setModalAddSensorShow(false)}>Add</Button>
        </Modal.Footer>
    </Modal>

    <Modal
        show={modalChangeDelayShow}
        onHide={() => setModalChangeDelayShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change delay
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Label>Delay</Form.Label>
              <Form.Control
                type="number"
                placeholder="500"
                autoFocus
              />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setModalChangeDelayShow(false)}>Close</Button>
          <Button onClick={() => setModalChangeDelayShow(false)}>Apply</Button>
        </Modal.Footer>
    </Modal>

    <Modal
        show={modalDeleteShow}
        onHide={() => setModalDeleteShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Are you sure you want to delete this sensor?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setModalDeleteShow(false)}>Close</Button>
          <Button variant='danger' onClick={() => setModalDeleteShow(false)}>Delete</Button>
        </Modal.Footer>
    </Modal>

    <Modal
        show={modalEditShow}
        onHide={() => setModalEditShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit sensor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="sensor..."
                autoFocus
              />
              <Form.Label>State</Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Turn on"
              />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setModalEditShow(false)}>Close</Button>
          <Button onClick={() => setModalEditShow(false)}>Apply</Button>
        </Modal.Footer>
    </Modal>
    </>
    )
}

export default Layout;