'use client'

import React, { useEffect } from 'react'
import { motion } from "motion/react"
import { Bike, Bus, Car, Truck } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'

function HeroSection({onAuthRequired}:{onAuthRequired:()=>void}) {
    const {userData}=useSelector((state:RootState)=>state.user)
    const router =useRouter()
   
    return (
        <div className='relative min-h-screen w-full overflow-hidden'>
            <div className='absolute inset-0 bg-cover bg-center' style=
                {{ backgroundImage: "url('/heroImage.jpg')" }} />
            <div className='absolute inset-0 bg-black/80' />
            <div className='relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center'>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className='text-white font-extrabold text-4xl sm:text-3xl md:text-7xl'
                >
                    Book Any Vehicle
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className='mt-9 max-w-xl text-gray-300'
                >
                    From daily rides to heavy transport-all in one platform.

                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mt-4 flex gap-8 text-gray-300'
                >
                    <Bike size={30} />
                    <Car size={30} />
                    <Bus size={30} />
                    <Truck size={30} />

                </motion.div>
                <motion.button
                    whileHover={{scale:1.05}}
                    whileTap={{scale:0.93}}
                    className='mt-10 px-10 py-4 bg-white text-black rounded-full font-semibold shadow-xl'
                    onClick={()=>{!userData?onAuthRequired():router.push("/user/book")}}
                >
                    Book Now
                </motion.button>

            </div>
        </div>
    )
}

export default HeroSection