'use client'

import { vehicleType } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, Bike, Car, CheckCircle, ChevronRight, LocateFixed, MapPin, Navigation, Package, Phone, Truck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

const VEHICLES = [
  { id: "bike", label: "Bike", icon: Bike, desc: "Quick & affordable" },
  { id: "auto", label: "Auto", icon: Car, desc: "Everyday rides" },
  { id: "car", label: "Car", icon: Car, desc: "Comfort rides" },
  { id: "loading", label: "Loading", icon: Package, desc: "Small cargo" },
  { id: "truck", label: "Truck", icon: Truck, desc: "Heavy transport" },
];

type Place = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  lat: number;
  lng: number;

}

function page() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<vehicleType>()
  const [mobile, setMobile] = useState("")
  const [pickUp, setPickUp] = useState("")
  const [drop, setDrop] = useState("")
  const [pickUpCountry, setPickUpCountry] = useState("")
  const [pickUpLat, setPickUpLat] = useState<Number>()
  const [pickUpLong, setPickUpLong] = useState<Number>()
  const [dropCountry, setDropCountry] = useState("")
  const [dropLat, setDropLat] = useState<Number>()
  const [dropLong, setDropLong] = useState<Number>()
  const [locating, setLocating] = useState(false)
  const [pickUpSuggestion, setPickUpSuggestions] = useState<Place[]>([])
  const [dropSuggestion, setDropSuggestions] = useState<Place[]>([])
  const progress = [!!vehicle, !!(mobile.length == 10), !!pickUp, !!drop].filter(Boolean).length
  const canContinue =
    !!(
      vehicle &&
      mobile.length === 10 &&
      pickUp &&
      drop &&
      pickUpLat &&
      pickUpLong &&
      dropLat &&
      dropLong
    );

  const searchAddress = async (q: string, setResults: (r: Place[]) => void, restrict?: string | null) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([])
        return
      }
      const { data } = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=8&lang=en`)

      let results: Place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        countrycode: f.properties.countrycode,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0]

      }))
      if (restrict) {
        results = results.filter(r => r.country == restrict)
      }

      setResults(results)
    } catch (error) {
      console.log(error)
      setResults([])
    }

  }
  const suggestion = (p: Place) => [p.name, p.city, p.state, p.country].filter(Boolean).join(",")
  const useCurrentLocation = () => {
    if (!navigator.geolocation) return

    setLocating(true)
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {

      try {
        const { data } = await axios.get(`https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}`)

        if (data.features.length) {
          const p = data.features[0].properties
          const address = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(",")
          setPickUp(address)
          setPickUpCountry(p.country)
          setPickUpLat(coords.latitude)
          setPickUpLong(coords.longitude)
          setPickUpSuggestions([])
          setLocating(false)
        }
      } catch (error) {
        console.log(error)
        setLocating(false)
      }
    })

  }

  return (
    <div className='min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10'>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-md'
      >
        <div className='flex items-center gap-4 mb-6 px-1'>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => router.push("/")}
            className='w-11 h-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors flex-shrink-0'
          >
            <ArrowLeft size={13} className='text-zinc-900' />

          </motion.button>
          <div className='flex-1 min-w-0'>
            <h1 className='text-zinc-900 text-xl font-black tracking-tight'>Book a Ride</h1>
            <p className='text-zinc-400 text-xs mt-0.5'>Fill in the details below</p>
          </div>

          <div className='flex items-center gap-1.5 flex-shrink-0'>
            {
              [0, 1, 2, 3].map((d, i) => (
                <motion.div
                  key={i}
                  animate={{ width: i < progress ? 20 : 8, background: i < progress ? "#09090b" : "#d4d4d8" }}
                  transition={{ duration: 0.3 }}
                  className='h-2 rounded-full'
                />
              ))
            }

          </div>

        </div>

        <div className='bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-visible'>

          <div className='h-1 bg-zinc-900 w-[90%] m-auto' />

          <div className='p-6 space-y-7'>
            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}

            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0'>
                  <span className='text-white text-[9px] font-black'>1</span>
                </div>
                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                  Choose Vehicle

                </p>
              </div>

              <div className='grid grid-cols-2 gap-2.5'>
                {VEHICLES.map((v, i) => {
                  const active = vehicle == v.id
                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.97 + i * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVehicle(v.id as vehicleType)}
                      className={`relative p-3.5 rounded-2xl border flex items-center gap-3 text-left transition-all duration-200 ${active ? "bg-zinc-900 border-zinc-900 shadow-lg"
                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 trannsition-colors ${active ? "bg-white" : "bg-zinc-200"
                        }`}>
                        <v.icon size={18} className={active ? "text-zinc-900" : "text-zinc-600"} />
                      </div>
                      <div className='min-w-0'>
                        <p className={`text-sm font-bold truncate ${active ? "text-white" : "text-zinc-900"}`}>{v.label}</p>
                        <p className={`text-[10px] truncate ${active ? "text-zinc-400" : "text-zinc-400"}`}>{v.desc}</p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='absolute top-2.5 right-2.5'
                      >
                        <CheckCircle size={13} className='text-white fill-white/20' />
                      </motion.div>


                    </motion.div>)
                })}
              </div>

            </motion.div>
            <div className='h-px bg-zinc-200' />

            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}

            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0'>
                  <span className='text-white text-[9px] font-black'>2</span>
                </div>
                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                  Mobile
                </p>
              </div>

              <div className='flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus-within:border-zinc-900 focus-within:bg-white transition-all'>
                <div className='w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center flex-shrink-0'>
                  <Phone size={14} className='text-zinc-600' />
                </div>
                <input
                  type='tel'
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder='Enter your mobile number'
                  inputMode='numeric'
                  maxLength={15}
                  className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none'
                />
                <AnimatePresence>
                  {mobile.length == 10 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle size={16} className='text-emerald-500 fill-emerald-50 flex-shrink-0' />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className='text-zinc-400 text-[10px] mt-1.5 ml-1'>Ride updates will be sent to this number</p>



            </motion.div>

            <div className='h-px bg-zinc-200' />

            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}

            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0'>
                  <span className='text-white text-[9px] font-black'>3</span>
                </div>
                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                  Route
                </p>
              </div>

              <div className='bg-zinc-50 border border-zinc-200 rounded-2xl overflow-visible'>
                <div className='relative z-30'>
                  <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>
                    <div className='flex flex-col items-center flex-shrink-0'>

                      <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow' />
                      <div className='w-px h-5 bg-zinc-300 mt-1' />

                    </div>
                    <input
                      value={pickUp}
                      onChange={(e) => {
                        setPickUp(e.target.value)
                        searchAddress(e.target.value, setPickUpSuggestions)

                      }}
                      placeholder='Pickup location'
                      className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none'
                    />
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={useCurrentLocation}
                      disabled={locating}
                      className='w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition-col flex items-center justify-center flex-shrink-0'
                    >
                      <LocateFixed size={14} className={`text-zinc-700 ${locating ? "animate-spin" : ""}`}
                      />

                    </motion.button>

                  </div>

                  <AnimatePresence>
                    {pickUpSuggestion?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 1, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className='absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-25 overflow-y-auto z-50'
                      >
                        {pickUpSuggestion.map((p, i) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => {
                              setPickUp(suggestion(p))
                              setPickUpCountry(p.country ?? "")
                              setPickUpLat(p.lat)
                              setPickUpLong(p.lng)
                              setPickUpSuggestions([])
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0'
                          >
                            <MapPin size={13} className='text-zinc-400 flex-shrink-0' />
                            <span className='text-sm text-zinc-800 font-medium truncate'>{suggestion(p)}</span>
                            <ChevronRight size={13} className='text-zinc-300 flex-shrink-0 ml-auto' />

                          </motion.div>
                        ))}

                      </motion.div>

                    )}
                  </AnimatePresence>

                </div>

                <div className='h-px bg-zinc-200' />

                <div className='relative z-10'>
                  <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>
                    <div className='flex flex-col items-center flex-shrink-0'>

                      <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow' />

                    </div>
                    <input
                      value={drop}
                      onChange={(e) => {
                        setDrop(e.target.value)
                        searchAddress(e.target.value, setDropSuggestions, pickUpCountry)

                      }}
                      disabled={!pickUpCountry}
                      placeholder={pickUpCountry ? 'Drop location' : 'Select PickUp Location First'}
                      className='flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none'
                    />

                    <Navigation size={14} className='text-zinc-300 flex-shrink-0' />

                  </div>

                  <AnimatePresence>
                    {dropSuggestion?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 1, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className='absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto z-50'
                      >
                        {dropSuggestion.map((p, i) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => {
                              setDrop(suggestion(p))
                              setDropCountry(p.country ?? "")
                              setDropLat(p.lat)
                              setDropLong(p.lng)
                              setDropSuggestions([])
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0'
                          >
                            <Navigation size={13} className='text-zinc-400 flex-shrink-0' />
                            <span className='text-sm text-zinc-800 font-medium truncate'>{suggestion(p)}</span>
                            <ChevronRight size={13} className='text-zinc-300 flex-shrink-0 ml-auto' />

                          </motion.div>
                        ))}

                      </motion.div>

                    )}
                  </AnimatePresence>

                </div>

              </div>



            </motion.div>

            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={canContinue ? { scale: 1.02 } : {}}
                disabled={!canContinue}
                onClick={() => {
                  const params = new URLSearchParams({
                    pickup: pickUp,
                    drop,
                    vehicle: vehicle!,
                    mobile,
                    pickupLat: String(pickUpLat),
                    pickupLong: String(pickUpLong),
                    dropLat: String(dropLat),
                    dropLong: String(dropLong),
                    pickupCountry: pickUpCountry,
                    dropCountry: dropCountry,
                  });

                  router.push(`/user/search?${params.toString()}`);
                }}
                className='w-full h-14 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-35 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2.5 transition-colors shadow-lg disabled:shadow-none'
              >

                <span>Continue</span>

              </motion.button>

            </motion.div>


          </div>
        </div>


      </motion.div>

    </div>
  )
}

export default page