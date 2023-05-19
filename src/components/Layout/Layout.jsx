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
import HiQuang from '../Chart/HiQuang';
import Test from '../Chart/Test';

const Layout = () => {
  const [sensors, setSensors] = useState([])
  const [speed, setSpeed] = useState(5000)
  const [newName, setNewName] = useState("")
  const [editName, setEditName] = useState("")
  const [state, setState] = useState(true)
  const [allState, setAllState] = useState(false)
  const [activeId, setActiveId] = useState(0);

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
      setSensors(sensors => sensors.map(s => ({...s, state: allState ? "ON" : "OFF"})))
    }).catch((e) => {
      toast.error(e.message)
    })
  }

  const editSensor = async () => {
    let tmp = sensors;
    let i = tmp.findIndex((s) => s.id === active.id)
    try {
      const data = await changeSensorName(active.id, editName)
      console.log(active.id);
      console.log(i);
      tmp[i].name = editName

      const dete = await changeSensorState(active.id, state ? "ON" : "OFF")
      tmp[i].state = state ? "ON" : "OFF"

      toast.success("Change information successful!")
      console.log(tmp)
      setSensors(tmp)
      setModalEditShow(false)
    } catch (e) {
      toast.error(e.message)
    }   
  }

  return (
    <>
      <Navbar bg="light" className="mb-3" fixed='top' >
        <Container fluid>
          <Navbar.Brand href="#" style={{fontSize: "28px"}}>Humidity</Navbar.Brand>
        </Container>
      </Navbar>
      <div style={{display: "flex", marginTop: "50px", justifyContent: "space-between"}}>
        <div style={{width: "30%", borderRadius: "10px", backgroundColor: " #d1e9fc", textAlign: "center", padding: "15px 0"}}>
          <p style={{color: "#0c2269", fontSize: "20px", marginBottom: "5px"}}>Max node</p>
          <h5 style={{color: "#0c2269", fontSize: "25px"}}>12</h5>
        </div>
        <div style={{width: "30%", borderRadius: "10px", backgroundColor: "#fff7cc", textAlign: "center", padding: "15px 0"}}>
          <p style={{color: "#7a4f01", fontSize: "20px", marginBottom: "5px"}}>CPU Usage</p>
          <h5 style={{color: "#7a4f01", fontSize: "25px"}}>76%</h5>
        </div>
        <div style={{width: "30%", borderRadius: "10px", backgroundColor: "#ffe7d9", textAlign: "center", padding: "15px 0"}}>
          <p style={{color: "#7f1534", fontSize: "20px", marginBottom: "5px"}}>RAM Usage</p>
          <h5 style={{color: "#7f1534", fontSize: "25px"}}>80%</h5>
        </div>
      </div>
      <div style={{marginTop: "40px", borderRadius: "5px", padding: "15px", backgroundColor: "#fff", boxShadow: "0 0 0 0 #999,  -5px 5px 5px -5px #999"}}>
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
        <Accordion flush onSelect={(activeIndex) => {setActiveId(activeIndex)}}>
          {sensors.map((sensor,i) =>
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
              {/* <QuangDepTrai id={i}/> */}
              {sensor.id ===activeId && <HiQuang id={sensor.id} delay={sensor.delay}/>}
              {/* <HiQuang id={sensor.id} delay={sensor.delay}/> */}

            </Accordion.Body>
          </Accordion.Item>
          )}
        </Accordion>
            <Test />

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