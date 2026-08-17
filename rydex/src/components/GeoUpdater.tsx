'use client'

import { getSocket } from '@/lib/socket'
import type { Socket } from 'socket.io-client'
import { useEffect, useRef } from 'react'

function GeoUpdater({ userId }: { userId: string }) {
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!userId) return

        const socket = getSocket()
        socketRef.current = socket
        socket.emit("identity", userId)

        if (!navigator.geolocation) return

        const watcher = navigator.geolocation.watchPosition(({coords}) => {
            socket.emit("update-location", {
                userId,
                latitude: coords.latitude,
                longitude: coords.longitude
            })
        },(error)=>{
            console.error(error)
        },{
            enableHighAccuracy: true,
            maximumAge: 5000
        })
        return ()=>{navigator.geolocation.clearWatch(watcher)}

    }, [userId])


    return null
}

export default GeoUpdater
