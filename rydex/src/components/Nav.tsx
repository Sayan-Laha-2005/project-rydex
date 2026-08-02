'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AuthModal from './AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { div } from 'motion/react-client';
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { setUserData } from '@/redux/userSlice';
import { useRouter } from 'next/navigation';

const Nav_Items = ["Home", "Booking", "About Us", "Contact"]

function Nav() {
    const pathName = usePathname()
    const [authOpen, setAuthOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    const router=useRouter()

    const handleLogOut = async () => {
        await signOut({ redirect: false })
        dispatch(setUserData(null))
        setProfileOpen(false)
    }
    return (
        <>
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={'fixed top-3 left-1/2 -translate-x-1/2 w-[94%] md:w-[86%] z-50 rounded-full bg-[#0B0B0B] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3'}
            >
                <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>
                    <Image src={"/logo.jpeg"} alt='logo' width={44} height={44} priority />
                    <div className='hidden md:flex items-center gap-10'>
                        {Nav_Items.map((i, index) => {
                            let href;
                            if (i == "Home") {
                                href = `/`
                            } else {
                                href = `/${i.toLowerCase()}`
                            }

                            const active = href == pathName
                            return <Link key={index} href={href} className={`text-sm font-medium transition
                        ${active
                                    ? "text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}>{i}</Link>
                        })}
                    </div>

                    <div className='flex items-center gap-3 relative'>
                        <div className='hidden md:block relative'>
                            {!userData ? (
                                <button className='px-4 py-1.5 rounded-full bg-white text-black text-sm'
                                    onClick={() => setAuthOpen(true)}
                                >
                                    Login
                                </button>

                            ) : (
                                <>
                                    <button className='w-11 h-11 rounded-full bg-white text-black font-bold' onClick={() => setProfileOpen(p => !p)}>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className='absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border'
                                            >

                                                <div className='p-5'>
                                                    <p className='font-semibold text-lg'>{userData.name}</p>
                                                    <p className='text-xs uppercase text-grey-500 mb-4'>{userData.role}</p>
                                                    {userData.role != "partner" && (
                                                        <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl' onClick={()=>router.push("/partner/onboarding/vehicle")}>
                                                            <div className='flex -space-x-2'>
                                                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Bike size={14} /></div>
                                                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Car size={14} /></div>
                                                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Truck size={14} /></div>


                                                            </div>
                                                            Become a Partner
                                                            <ChevronRight size={16} className='ml-auto' />

                                                        </div>
                                                    )}
                                                    <button className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogOut}>
                                                        <LogOut size={16} />
                                                        Logout
                                                    </button>

                                                </div>


                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </>
                            )

                            }

                        </div>


                        <div className='md:hidden'>
                            {!userData ? (
                                <button className='px-4 py-1.5 rounded-full bg-white text-black text-sm'
                                    onClick={() => setAuthOpen(true)}
                                >
                                    Login
                                </button>

                            ) : (
                                <>
                                    <button className='w-11 h-11 rounded-full bg-white text-black font-bold' onClick={() => setProfileOpen(p => !p)}>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </button>



                                </>
                            )

                            }

                        </div>

                        <button className='md:hidden text-white' onClick={() => setMenuOpen(p => !p)}>
                            {menuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>


                    </div>

                </div>


            </motion.div>

            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className='fixed inset-0 bg-black z-30 md:hidden'
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className='fixed top-[85px] left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden'
                        >
                            <div className='flex flex-col divide-y divide-white/10'>
                                {Nav_Items.map((i, index) => {
                                    let href;
                                    if (i == "Home") {
                                        href = `/`
                                    } else {
                                        href = `/${i.toLowerCase()}`
                                    }

                                    return <Link key={index} href={href} className="px-6 py-4 text-gray-30 hover:bg-white/5">{i}</Link>

                                })}

                            </div>

                        </motion.div>
                    </>

                )}
            </AnimatePresence>

            <AnimatePresence>
                {profileOpen && userData && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProfileOpen(false)}
                            className='fixed inset-0 bg-black z-30 md:hidden'
                        />
                        <motion.div
                            initial={{ y: 400 }}
                            animate={{ y: 0 }}
                            exit={{ y: 400 }}
                            transition={{ type: "spring", damping: 25 }}
                            className='fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden'

                        >
                            <div className='p-5'>
                                <p className='font-semibold text-lg'>{userData.name}</p>
                                <p className='text-xs uppercase text-grey-500 mb-4'>{userData.role}</p>
                                {userData.role != "partner" && (
                                    <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl' onClick={()=>router.push("/partner/onboarding/vehicle")}>
                                        <div className='flex -space-x-2'>
                                            <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Bike size={14} /></div>
                                            <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Car size={14} /></div>
                                            <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Truck size={14} /></div>


                                        </div>
                                        Become a Partner
                                        <ChevronRight size={16} className='ml-auto' />

                                    </div>
                                )}
                                <button className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogOut}>
                                    <LogOut size={16} />
                                    Logout
                                </button>

                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    )
}

export default Nav