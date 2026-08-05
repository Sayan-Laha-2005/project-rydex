import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Image from "next/image";

export default async function Home() {

  await connectDb()
  const session=await auth()
  const user=await User.findOne({email:session?.user?.email})
  console.log(session);
  return (
    <div className="w-full min-h-screen bg-white"> 
    {user?.role === "partner" && (
      <GeoUpdater userId={user._id.toString()} />
    )}
      
    {user?.role=="partner"
    ?
    <>
    <Nav/> 
    <PartnerDashboard/>
    </>
    :
    (
      user?.role=="admin" 
      ?
      <AdminDashboard/>
      :
      <>
      <Nav/> 
      <PublicHome/>
      </>
    )
  }
    
    <Footer/>
    </div>
  );
}
