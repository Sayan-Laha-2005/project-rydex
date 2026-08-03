'use client'

import { ArrowLeft, MapPin, Navigation } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import axios from 'axios'
import { IVehicle } from '@/models/vehicle.model'

const SearchMap = dynamic(
    () => import("@/components/SearchMap"),
    { ssr: false }
);

function page() {
    const router = useRouter()
    const params = useSearchParams()
    const [pickUp, setPickUp] = useState(params.get("pickup") || "")
    const [drop, setDrop] = useState(params.get("drop") || "")
    const [km, setKm] = useState<number>()
    const mobile = params.get("mobile")
    const vehicle = params.get("vehicle")
    const pickUpLat = Number(params.get("pickupLat"))
    const pickUpLong = Number(params.get("pickupLong"))
    const dropLat = Number(params.get("dropLat"))
    const dropLong = Number(params.get("dropLong"))
    const [vehicles, setVehicles] = useState<IVehicle[]>([])
    const [loading, setLoading] = useState(false)

    const getNearByVehicles = async (latitude: number, longitude: number, vehicleType: string | null) => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/vehicles/near-by", { latitude, longitude, vehicleType })
            setVehicles(data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    useEffect(() => {
        getNearByVehicles(pickUpLat, pickUpLong, vehicle)
    }, [pickUpLat, pickUpLong])


    return (
        <div className='min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden'>
            <div className='absolute top-5 left-5 z-50'>
                <motion.div
                    whileTap={{ scale: 0.88 }}
                    onClick={() => router.back()}
                    className='w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors'
                >
                    <ArrowLeft size={17} className='text-zinc-900' />

                </motion.div>

            </div>
            <div className='relative w-full h-[52vh] z-0'>
                <SearchMap
                    pickUp={pickUp}
                    drop={drop}


                    onChange={(p, d) => {
                        setPickUp(p)
                        setDrop(d)
                    }}

                    onDistance={setKm}
                />


            </div>

            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                className='relative z-20 -mt-10 bg-white rounded-t-[28px] border-t boder-zinc-200 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pt-5 pb-20 min-h-[52vh]'
            >
                <div className='px-5 lg:px-8 max-w-6xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-5'
                    >
                        <div className='flex gap-3 px-4 py-3 border-b border-zinc-100'>
                            <div className='flex flex-col items-center pt-1.5 flex-shrink-0'>
                                <div className='w-2.5 h-2.5 rounded-full bg-zinc-900' />
                                <div className='w-px flex-1 bg-zinc-300 my-1' style={{ minHeight: 14 }} />
                            </div>

                            <div className='flex-1 min-w-0'>
                                <p className='text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5'>Pick Up</p>
                                <p className='text-sm text-zinc-900 font-semibold leading-snug truncate'>{pickUp || "-"}</p>
                            </div>
                            <MapPin size={15} className='text-zinc-400 flex-shrink-0 mt-1.5' />
                        </div>

                        <div className='flex gap-3 px-4 py-3 border-b border-zinc-100'>
                            <div className='flex flex-col items-center pt-1.5 flex-shrink-0'>
                                <div className='w-2.5 h-2.5 rounded-full bg-zinc-900' />
                            </div>

                            <div className='flex-1 min-w-0'>
                                <p className='text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5'>Drop</p>
                                <p className='text-sm text-zinc-900 font-semibold leading-snug truncate'>{drop || "-"}</p>
                            </div>
                            <Navigation size={15} className='text-zinc-400 flex-shrink-0 mt-1.5' />
                        </div>

                    </motion.div>

                    <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{ delay: 0.2 }}
                    className='flex items-center justify-between mb-'
                    >
                        <div>
                            <h2>
                                
                            </h2>
                        </div>

                    </motion.div>
                </div>

            </motion.div>

        </div>
    )
}

export default page