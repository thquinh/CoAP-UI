import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from 'react';
import { getAllSensorInfo, deleteSensor, addSensor, changeSensorState, changeSensorName, changeAllSensorState, getMaxNode, getMessages } from '../../apis/apis';
import RealChart from '../Chart/Chart';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { changeSpeed } from '../../apis/apis';
import { toast } from 'react-toastify';
import HiQuang from '../Chart/HiQuang';
import Sensors from '../Chart/Test';

const Layout = () => {
  const [sensors, setSensors] = useState([])
  const [speed, setSpeed] = useState(5000)
  const [newName, setNewName] = useState("")
  const [editName, setEditName] = useState("")
  const [state, setState] = useState(true)
  const [allState, setAllState] = useState(true)
  const [activeId, setActiveId] = useState(0);
  const [maxNode, setMaxNode] = useState(0)
  const [countNode, setCountNode] = useState(0)
  const [usageCPU, setUsageCPU] = useState(0)
  const [usageRam, setusageRam] = useState(0)
  const [throughput, setThroughput] = useState(0)

  const [modalAddSensorShow, setModalAddSensorShow] = useState(false);
  const [modalChangeDelayShow, setModalChangeDelayShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [modalAllStateShow, setModalAllStateShow] = useState(false);
  const [active, setActive] = useState({});
  const [messages, setMessages] = useState([])
  const [oldState, setOldState] = useState(true)
  const [oldSpeed, setOldSpeed] = useState(5000)
  const [tempState, setTempState] = useState(true)

  useEffect(() => {
    getMaxNode().then((data) => {
      setMaxNode(data);

      getAllSensorInfo().then((data) => {
        setSensors(data)
        setCountNode(data.length)
        setSpeed(data[0].delay !== undefined ? data[0].delay : 5)
        setOldSpeed(data[0].delay !== undefined ? data[0].delay : 5)
      }).catch((e) => {
        toast.error(e.message)
      })

      getMessages().then((data) => {
        setMessages(data)
      }).catch((e) => {
        toast.error(e.message)
      })
      const evSource = new EventSource('http://localhost:9999/api/v1/gateway/performance');

      evSource.onmessage = (event) => {
        let tmp = JSON.parse(event.data)
        setUsageCPU(tmp.usageCpu)
        setusageRam(tmp.usageRam)
        setThroughput(tmp.throughput)
      };

      evSource.onerror = (error) => {
        toast.error('EventSource error: ' + error);
      };

      return () => {
        evSource.close();
      };
    })
  }, [])

  const deleteSensorByID = () => {
    deleteSensor(active.id).then((data) => {
      setModalDeleteShow(false)
      setCountNode(countNode - 1)
      let tmp = sensors;
      tmp.splice(tmp.findIndex((s) => s.id === active.id), 1)
      setSensors(tmp)
      let temp = {
        timestamp: data.timestamp,
        message: data.controlMessage
      }
      setMessages((prev) => [...prev, temp])
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
      setCountNode(countNode + 1)
      setNewName("")
      let tmp = sensors
      tmp.push(data)
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
    if (speed < 1000) {
      toast.error("The minimum speed is 1000 ms")
    } else {
      if (oldSpeed != speed) {
        changeSpeed(speed).then((data) => {
          setModalChangeDelayShow(false)
          let tmp = sensors;
          tmp.forEach((s) => {
            s.delay = speed
          })
          setSensors(tmp)
          let temp = {
            timestamp: data.timestamp,
            message: data.controlMessage
          }
          setMessages((prev) => [...prev, temp])
          toast.success("Your changes have been saved!")
        }).catch((e) => {
          toast.error(e.message)
        })
      } else {
        setModalChangeDelayShow(false)
      }
    }
  }

  const onActive = (sensor) => {
    setActive(sensor)
    setEditName(sensor.name)
    setState(sensor.state.toUpperCase() === "ON" ? true : false)
    setOldState(sensor.state.toUpperCase() === "ON" ? true : false)
  }

  const onChangeAllState = (e) => {
    setTempState(e.target.checked)
    setModalAllStateShow(true)
  }

  const changeAllState = () => {
    changeAllSensorState(tempState ? "ON" : "OFF").then((data) => {
      toast.success("Change state of all sensors successful!")
      setSensors(sensors => sensors.map(s => ({ ...s, state: tempState ? "ON" : "OFF" })))
      let tmp = {
        timestamp: data.timestamp,
        message: data.controlMessage
      }
      setMessages((prev) => [...prev, tmp])
      setAllState(tempState)
      setModalAllStateShow(false)
    }).catch((e) => {
      toast.error(e.message)
    })
  }

  const editSensor = async () => {
    let tmp = sensors;
    let i = tmp.findIndex((s) => s.id === active.id)
    try {
      const data = await changeSensorName(active.id, editName)
      tmp[i].name = editName
      if (state != oldState) {
        const dete = await changeSensorState(active.id, state ? "ON" : "OFF").then((data) => {
          let tmp = {
            timestamp: data.timestamp,
            message: data.controlMessage
          }
          setMessages((prev) => [...prev, tmp])
          console.log(data)
        })
        tmp[i].state = state ? "ON" : "OFF"
      }

      toast.success("Change information successful!")
      setSensors(tmp)
      setModalEditShow(false)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const formatThroughput = (throughput) => {
    if (throughput >= 1000000) {
      const Mbps = (throughput / 1000000).toFixed(2);
      return Number(Mbps) + ' Mbps';
    } else if (throughput >= 1000) {
      const kbps = (throughput / 1000).toFixed(2);
      return Number(kbps) + ' kbps';
    } else {
      return throughput + ' bps';
    }
  }

  return (
    <>
      <Navbar className="mb-3" fixed='top' style={{ backgroundColor: "#5ac0d9" }}>
        <Container fluid>
          <Navbar.Brand href="#" style={{ fontSize: "28px", color: "white" }}>Humidity</Navbar.Brand>
        </Container>
      </Navbar>

      <h5 style={{ marginTop: "50px", color: "#0d6da2" }}>Performance</h5>
      <div style={{ display: "flex", marginTop: "15px", justifyContent: "space-between" }}>
        <div style={{ width: "24%", borderRadius: "10px", backgroundColor: " #d1e9fc", textAlign: "center", padding: "15px 0" }}>
          <p style={{ color: "#0c2269", fontSize: "20px", marginBottom: "5px" }}>Max node</p>
          <h5 style={{ color: "#0c2269", fontSize: "25px" }}>{maxNode}</h5>
        </div>
        <div style={{ width: "24%", borderRadius: "10px", backgroundColor: "#d0f2fe", textAlign: "center", padding: "15px 0" }}>
          <p style={{ color: "#061d64", fontSize: "20px", marginBottom: "5px" }}>CPU Usage</p>
          <h5 style={{ color: "#061d64", fontSize: "25px" }}>{Number(usageCPU.toFixed(1))}%</h5>
        </div>
        <div style={{ width: "24%", borderRadius: "10px", backgroundColor: "#fff7cc", textAlign: "center", padding: "15px 0" }}>
          <p style={{ color: "#7a4f01", fontSize: "20px", marginBottom: "5px" }}>RAM Usage</p>
          <h5 style={{ color: "#7a4f01", fontSize: "25px" }}>{Number(usageRam.toFixed(1))}%</h5>
        </div>
        <div style={{ width: "24%", borderRadius: "10px", backgroundColor: "#ffe7d9", textAlign: "center", padding: "15px 0" }}>
          <p style={{ color: "#7f1534", fontSize: "20px", marginBottom: "5px" }}>Throughput</p>
          <h5 style={{ color: "#7f1534", fontSize: "25px" }}>{formatThroughput(throughput)}</h5>
        </div>
      </div>

      <h5 style={{ marginTop: "40px", marginBottom: "10px", color: "#0d6da2" }}>Detail</h5>
      <div style={{ borderRadius: "5px", padding: "15px", backgroundColor: "#fff", boxShadow: "0 0 0 0 #999,  -5px 5px 5px -5px #999" }}>
        <Button style={{ float: "right" }} onClick={() => setModalAddSensorShow(true)} disabled={countNode >= maxNode}>Add sensor</Button>
        <Button style={{ float: "right", marginRight: "15px" }} onClick={() => setModalChangeDelayShow(true)}>Change delay</Button>
        <Form.Check style={{ float: "right", marginRight: "40px" }}// prettier-ignore
          type="switch"
          id="custom-switch"
          label={`Turn ${allState ? "off" : "on"} all sensors`}
          checked={allState}
          onChange={onChangeAllState}
        />
        <br />
        <br />
        <Accordion flush onSelect={(activeIndex) => {setActiveId(activeIndex)}} alwaysOpen>
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
              {/* {sensor.id ===activeId && <HiQuang id={sensor.id} delay={sensor.delay}/>} */}
              {/* <HiQuang id={sensor.id} delay={sensor.delay}/> */}
              <Sensors id={sensor.id} delay={sensor.delay} on={sensor.state.toUpperCase() === "ON"} />

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
            <Button variant='secondary' onClick={() => setModalAddSensorShow(false)}>Cancel</Button>
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
            <Form.Label>Delay (miliseconds)</Form.Label>
            <Form.Control
              type="number"
              placeholder="5"
              value={speed}
              onChange={onChangeSpeed}
              autoFocus
            />
            <span style={{ float: "right" }}><i>Min 1000 ms</i></span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setModalChangeDelayShow(false)}>Cancel</Button>
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
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this sensor?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setModalDeleteShow(false)}>Cancel</Button>
            <Button variant='danger' onClick={deleteSensorByID}>Delete</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={modalAllStateShow}
          onHide={() => setModalAllStateShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to turn {allState ? "off" : "on"} all sensors?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setModalAllStateShow(false)}>Cancel</Button>
            <Button variant='primary' onClick={changeAllState}>OK</Button>
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
            <Button variant='secondary' onClick={() => setModalEditShow(false)}>Cancel</Button>
            <Button onClick={editSensor}>Apply</Button>
          </Modal.Footer>
        </Modal>
      </div>

      <h5 style={{ color: "#0d6da2", marginBottom: "15px", marginTop: "40px" }}>Control messages</h5>
      <div style={{ paddingBottom: "40px", backgroundColor: "white" }}>
        <Table striped bordered hover style={{ boxShadow: "0 0 0 0 #999,  -5px 5px 5px -5px #999" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((mes, i) =>
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{mes.timestamp}</td>
                <td>{mes.message}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default Layout;