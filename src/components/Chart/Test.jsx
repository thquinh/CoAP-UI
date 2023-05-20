import { useEffect, useState } from 'react'
import {
    BarChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList, 
    Bar
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
    const style = {
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
        backgroundColor: 'white', 
        padding: '10px'
    }

    if (active && payload && payload.length)
    {
        return (
            <div style={style}>   
                <p>Humidity: {payload[0].payload.humidity}</p>    
                <p>Latency: {payload[0].payload.latency}</p>    
                <p>Throughput: {payload[0].payload.throughput}</p> 
                <p>Time: {payload[0].payload.timestamp}</p> 
            </div>
        );
    }
    return null;
}

const Sensors = ({id, delay, on}) => {
    const [data, setData] = useState([])  
    const [latency, setLatency] = useState(0)
    const [throughput, setThroughput] = useState(0)

    function getNewSeries(sensorData) {
        sensorData.name = sensorData.timestamp
        setData(pre => {
            if (pre.length >= 10) return [...pre.slice(1), sensorData]
            return [...pre, sensorData]
        })
	}

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:9999/api/v1/gateway/${id}/data`)
        let newData
        eventSource.onmessage = (event) => {
            newData = JSON.parse(event.data)
            
        }

        const inter = setInterval(() => {
            getNewSeries(newData)
            console.log(newData);
            setLatency(newData.latency)
            setThroughput(newData.throughput)
        }, delay);
        console.log(on);

        if(!on) {
            eventSource.close();
            clearInterval(inter);
        }

        return () => {
            eventSource.close();
            clearInterval(inter);
        }
    }, [])

    function CustomizedTick(props) {
        const { x, y, stroke, payload } = props;
        const timeValue = payload.value.split(' ');
        return (
            <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} fill="#666">
              <tspan textAnchor="middle" x="0">
                {timeValue[0]}
              </tspan>
              <tspan textAnchor="middle" x="0" dy="20">
                {timeValue[1]}
              </tspan>
            </text>
          </g>
        );
    }

    return (
        <div>
            <div style={{}}>
                <div>Latency: {latency}</div>
                <div>Throughput: {throughput}</div>
            </div>
            <ResponsiveContainer height='100%' width='100%' minHeight={400}>
                <BarChart data={data} margin={{ top: 5, right: 50, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={<CustomizedTick />} tickCount={10} />
                    <YAxis domain={[0.8, 0.9]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{bottom: 0}} />
                    {/* <Line type="monotone" dataKey="humidity" stroke="#8884d8" activeDot={{ r: 8 }}  /> */}
                    <Bar dataKey="humidity" fill="#8884d8">
                        <LabelList dataKey="humidity" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Sensors
