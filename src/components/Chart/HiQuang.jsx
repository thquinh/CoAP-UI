import { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

const HiQuang = ({id, delay}) => {
	delay = delay === undefined ? 5000 : delay;
	let data = [];
	let TICKINTERVAL = 86400000
	const XAXISRANGE = 777600000
	const [datas, setDatas] = useState([])
	let lastDate = 0;

	function getNewSeries(baseval, yval, xval) {
		console.log(xval);
		let time = xval.split(" ")
		let day = time[0].split("-") // dd-mm-yyy
		let timeInDay = time[1].split(":") // hh-mm-ss
		let currentTime = new Date(day[2], day[1], day[0], ...timeInDay).getTime()
		console.log(currentTime);

		var newDate = baseval + TICKINTERVAL;
		lastDate = newDate
	
		for(var i = 0; i< data.length - 10; i++) {
			data[i].x = newDate - XAXISRANGE - TICKINTERVAL
			data[i].y = 0
		}
	
		data.push({
			x: newDate,
			y: yval
		})
	}

	useEffect(() => {
		const eventSource = new EventSource(`http://localhost:9999/api/v1/gateway/${id}/data`);
		let yval, xval;
		eventSource.onmessage = (event) => {
			const newData = JSON.parse(event.data);
			console.log(newData);
			
			// data.push({ y:Math.round(newData.humidity*100)/100, x: TICKINTERVAL++});
			yval = Math.round(newData.humidity*100)/100
			xval = newData.timestamp
			console.log(data);
			setDatas((prevData) => {
                return [...prevData, newData]
            });
		};

		eventSource.onerror = function(e){
			console.log(e);
			eventSource.close()
		};

		const inter = setInterval(() => {
			getNewSeries(lastDate, yval, xval)
			ApexCharts.exec('realtime', 'updateSeries', [{ data }]);
		}, delay);

		return () => {
			eventSource.close();
			clearInterval(inter);
		};
	}, []);

	const series = [
		{
			name: 'humidity',
			data,
		},
	];
	const options = {
		chart: {
			id: 'realtime',
			height: 350,
			type: 'area',
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: delay,
				},
			},
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			// curve: 'smooth',
		},
		title: {
			text: 'Dynamic Updating Chart',
			align: 'left',
		},
		markers: {
			size: 0,
		},
		xaxis: {
			type: 'numeric',
            range: XAXISRANGE,
			// labels: {
			// 	formatter: function (value) {
			// 		return `${Math.round(value*2)} is hihi`;
			// 	}
			// },
			tickAmount: 9,
			title:{
				text: 'Humidity sensor data'
			}
		},
		yaxis: {
			max: 0.9,
			min: 0.8,
		},
		legend: {
			show: false,
		},
	};

	return (
		<div>
			<div id='chart'>
				<ReactApexChart options={options} series={series} type='line' height={350} />
			</div>
			<div id='html-dist'></div>
		</div>
	);
};

export default HiQuang;
