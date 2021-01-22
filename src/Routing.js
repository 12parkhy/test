import React, { useEffect } from 'react'
import L from 'leaflet'
import "leaflet-routing-machine";

function Routing(props) {
    useEffect(() => {
        console.log(L)
        L.Routing.control({
            waypoints: [
                L.latLng(37.56, 126.99),
                L.latLng(37.5, 127.25)
            ],
            language: "ko",
            lineOptions: {
                styles: [
                    {
                        color: "blue",
                        opacity: 0.5,
                        weight: 6.5
                    }
                ]
            },
            
            createMarker: (i, waypoint, n) => {
                const marker = L.marker(
                    waypoint.latLng,
                    {
                        icon: L.icon({
                            iconUrl: '/marker.svg',
                            iconSize: [25, 25]
                        })
                    }
                )
                return marker
            },

        }).addTo(props.map)
    }, [])

    return (
        <></>
    )
}

export default Routing