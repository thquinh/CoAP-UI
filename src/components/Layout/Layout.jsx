import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from 'react';
import { getAllSensorInfo, deleteSensor, addSensor, changeSensorState, changeSensorName, changeAllSensorState } from '../../apis/apis';
import RealChart from '../Chart/Chart';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { changeSpeed } from '../../apis/apis';
import { toast } from 'react-toastify';

const Layout = () => {
  const [sensors, setSensors] = useState([])
  const [speed, setSpeed] = useState(5000)
  const [newName, setNewName] = useState("")
  const [editName, setEditName] = useState("")
  const [state, setState] = useState(true)
  const [allState, setAllState] = useState(false)

  const [modalAddSensorShow, setModalAddSensorShow] = useState(false);
  const [modalChangeDelayShow, setModalChangeDelayShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [active, setActive] = useState({});

  useEffect(() => {
    getAllSensorInfo().then((data) => {
      setSensors(data)
      setSpeed(data[0].delay !== undefined ? data[0].delay : 5)
    }).catch((e) => {
      toast.error(e.message)
    })
  }, [])

  const deleteSensorByID = () => {
    deleteSensor(active.id).then((data) => {
      setModalDeleteShow(false)
      let tmp = sensors;
      tmp.splice(tmp.findIndex((s) => s.id === active.id), 1)
      console.log(tmp)
      setSensors(tmp)
      toast.success("Delete sensor successful!")
    }).catch((e) => {
      toast.error(e.message)
    })
  }

  const onChangeNewName = (e) => {
    setNewName(e.target.value)
  }

  const addNewSensor = () => {
    addSensor(newName).then((data) => {
      setModalAddSensorShow(false)
      let tmp = sensors
      tmp.push(data)
      console.log(tmp)
      setSensors(tmp)
      toast.success("New sensor has been added!")
    }).catch((e) => {
      toast.error(e.message)
    })
  }

  const onChangeSpeed = (e) => {
    setSpeed(e.target.value)
  }

  const onChangeEditName = (e) => {
    setEditName(e.target.value)
  }

  const changeDelay = () => {
    changeSpeed(speed).then((data) => {
      setModalChangeDelayShow(false)
      let tmp = sensors;
      tmp.forEach((s) => {
        s.delay = speed
      })
      setSensors(tmp)
      toast.success("Your changes have been saved!")
    }).catch((e) => {
      toast.error(e.message)
    })
  }

  const onActive = (sensor) => {
    setActive(sensor)
    setEditName(sensor.name)
    setState(sensor.state.toUpperCase() === "ON" ? true : false)
  }

  const onChangeAllState = (e) => {
    setAllState(e.target.checked)
    changeAllSensorState(allState ? "ON" : "OFF").then((data) => {
      toast.success("Change state of all sensors successful!")
    }).catch((e) => {
      toast.error(e.message)
    })
  }

  const editSensor = () => {
    let tmp = sensors;
    let i = tmp.findIndex((s) => s.id === active.id)
    
    changeSensorName(active.id, editName).then((data) => {
      tmp[i].name = editName
    }).catch((e) => {
      toast.error(e.message)
    })
    changeSensorState(active.id, state ? "ON" : "OFF").then((data) => {
      tmp[i].state = state ? "ON" : "OFF"
    }).catch((e) => {
      toast.error(e.message)
    })
    toast.success("Change information successful!")
    console.log(tmp)
    setSensors(tmp)
    setModalEditShow(false)
  }

  return (
    <>
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
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <div style={{marginTop: "40px"}}>
        <Button style={{ float: "right" }} onClick={() => setModalAddSensorShow(true)}>Add sensor</Button>
        <Button style={{ float: "right", marginRight: "15px" }} onClick={() => setModalChangeDelayShow(true)}>Change delay</Button>
        <Form.Check style={{ float: "right", marginRight: "40px" }}// prettier-ignore
          type="switch"
          id="custom-switch"
          label={`Turn ${allState ? "off" : "on"} all sensors`}
          onChange={onChangeAllState}
        />
        <br />
        <br />
        <Accordion flush>
          {sensors.map((sensor) =>
          <Accordion.Item eventKey={sensor.id} key={sensor.id}>
            <Accordion.Header>{sensor.name}</Accordion.Header>
            <Accordion.Body>
              <Button variant='danger' style={{ float: "right" }} onClick={() => { setModalDeleteShow(true); onActive(sensor)}} disabled={sensor.state.toUpperCase() === "ON" ? true : false}>Delete</Button>
              <Button style={{ float: "right", marginRight: " 15px" }} onClick={() => { setModalEditShow(true); onActive(sensor)}}>Edit</Button>
              <div style={{ display: "inline" }}>
                <h4>Information</h4>
                <span >ID: {sensor.id}</span>
                <br />
                <span>Name: {sensor.name}</span><br />
                <span>Delay: {sensor.delay / 1000} s</span><br />
                <span>State: {sensor.state}</span><br />
              </div>
              <br />
              <RealChart></RealChart>

            </Accordion.Body>
          </Accordion.Item>
          )}
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
              onChange={onChangeNewName}
              value={newName}
              autoFocus
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setModalAddSensorShow(false)}>Close</Button>
            <Button onClick={addNewSensor}>Add</Button>
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
            <Form.Label>Delay (seconds)</Form.Label>
            <Form.Control
              type="number"
              placeholder="5"
              value={speed}
              onChange={onChangeSpeed}
              autoFocus
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setModalChangeDelayShow(false)}>Close</Button>
            <Button onClick={changeDelay}>Apply</Button>
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
            <Button variant='danger' onClick={deleteSensorByID}>Delete</Button>
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
              value={editName}
              onChange={onChangeEditName}
              autoFocus
            />
            <Form.Label>State</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={state}
              onChange={(e) => setState(e.target.checked)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setModalEditShow(false)}>Close</Button>
            <Button onClick={editSensor}>Apply</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default Layout;