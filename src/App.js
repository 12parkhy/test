import React, { useState, useEffect } from 'react'
import { Icon } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, MapConsumer } from 'react-leaflet'
import axios from 'axios'
import Routing from './Routing'
import './App.css';

const coronaVrius = new Icon({
  iconUrl: '/coronavirus.svg',
  iconSize: [25, 25]
})
const thermal = new Icon({
  iconUrl: '/heating.svg',
  iconSize: [25, 25]
})
const entertainment = new Icon({
  iconUrl: '/male-disc-jockey.svg',
  iconSize: [25, 25]
})
const night = new Icon({
  iconUrl: '/half-moon.svg',
  iconSize: [25, 25]
})
const fire = new Icon({
  iconUrl: '/fire.svg',
  iconSize: [25, 25]
})

function App() {
  const [activeCovidInfo, setActiveCovidInfo] = useState(null)
  const [activeOtcInfo, setActiveOtcInfo] = useState(null)
  console.log("CI", activeCovidInfo)
  console.log("OTCI", activeOtcInfo)
  const [coviData, setCovidData] = useState([])
  const [otcData, setOtcData] = useState([])
  const [status1, setStatus1] = useState(true)
  const [status2, setStatus2] = useState(true)

  useEffect(() => {
    axios.get('./covidData.json')
      .then((res) => {
        setCovidData(res.data)
      })
    axios.get('./otcData.json')
      .then((res) => {
        setOtcData(res.data)
      })
    console.log(coviData, otcData)
  }, [])

  const handleCoronaVirusData = () => {
    setStatus1((prevStatus1) => { return !prevStatus1 })
  }
  const handleOtcData = () => {
    setStatus2((prevStatus2) => { return !prevStatus2 })
  }
  const [mapInfo, setMapInfo] = useState(null)
  
  return (
    <>
      <button onClick={() => handleCoronaVirusData()}>{status1 ? 'Remove Corona Virus Data' : 'Show Corona Virus Data'}</button>
      <button onClick={() => handleOtcData()}>{status2 ? 'Remove OTC Data' : 'Show OTC Data'}</button>
      
      <MapContainer className="leaflet-map-container" center={[37.55070021748518, 127.16837812708327]} zoom={12}>
      <MapConsumer>
        {(map) => {
          setMapInfo(map)
          return null
        }}
      </MapConsumer>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {status1 && coviData.length > 0 && coviData.map((c, index) => (
          <Marker
            key={index}
            position={[
              c.lat,
              c.long
            ]}
            eventHandlers={{
              click: (e) => {
                setActiveCovidInfo(c);
                // console.log(e.latlng)
                // console.log('clicked', e)
              },
            }}
            icon={coronaVrius}
          >
            {(
              <Popup
                position={[
                  c.long,
                  c.lat
                ]}
              >
                <div>
                  <h1>{activeCovidInfo != null ? activeCovidInfo['location_name'] : ''}</h1>
                  <p>{activeCovidInfo != null ? activeCovidInfo.lat : ''}</p>
                  <p>{activeCovidInfo != null ? activeCovidInfo.long : ''}</p>
                  <p>{activeCovidInfo != null ? activeCovidInfo['num_infected'] : ''}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        {status2 && otcData.length > 0 && otcData.map((d, index) => (
          <Marker
            key={index}
            position={[
              d.lat,
              d.long
            ]}
            eventHandlers={{
              click: (e) => {
                setActiveOtcInfo(d);
                // console.log(e.latlng)
                // console.log('clicked', e)
              },
            }}
            icon={d.cate == 'thermal' ? thermal : d.cate == 'entertainment' ? entertainment : d.cate == 'night' ? night : fire}
          >
            {(
              <Popup
                position={[
                  d.long,
                  d.lat
                ]}
              >
                <div>
                  <h1>{activeOtcInfo != null ? activeOtcInfo['cate'] : ''}</h1>
                  <p>{activeOtcInfo != null ? activeOtcInfo.lat : ''}</p>
                  <p>{activeOtcInfo != null ? activeOtcInfo.long : ''}</p>
                  <p>{activeOtcInfo != null ? activeOtcInfo['temp'] : ''}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        {mapInfo != null && <Routing map={mapInfo}/>}
      </MapContainer>
    </>
  );
}

export default App;
