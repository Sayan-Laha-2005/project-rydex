'use client'

import axios from 'axios'
import React, { useEffect } from 'react'

function page() {
    useEffect(()=>{
        const fetch=async ()=>{
            try {
                const {data}=await axios.get("/api/partner/bookings")
                console.log(data)
            } catch (error:any) {
                console.log(error.response.data.message)
            }
        }
        fetch()
    },[])
  return (
    <div>

    </div>
  )
}

export default page