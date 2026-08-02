import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "unauthorized" }, { status: 400 })
        }
        

        const { id } = await context.params
        console.log("PARTNER ID RECEIVED:", id)
        const partnerId = id
        const partner = await User.findById(partnerId)

        if (!partner || partner.role !== "partner") {
            return Response.json(
                { message: "partner not found" },
                { status: 400 }
            )
        }

        if(partner.partnerStatus==="approved"){
            return Response.json(
                { message: "partner already Approved" },
                { status: 400 }
            )
        }

        const partnerDocs=await PartnerDocs.findOne({owner:partner._id})
        const partnerBank=await PartnerBank.findOne({owner:partner._id})

        if(!partnerDocs || !partnerBank){
            return Response.json(
                { message: "partner did not complete on boarding steps" },
                { status: 400 }
            )
        }


        partner.partnerStatus="approved"
        partner.videoKycStatus="pending"
        partner.partnerOnBoardingSteps=4
        await partner.save()

        partnerDocs.status="approved"
        await partnerDocs.save()

        partnerBank.status="verified"
        await partnerBank.save()

        return Response.json(
            {message:"partner approved successfully"},
            {status:200}
        )



    } catch (error) {
        return Response.json(
            {message:`partner approved error ${error}`},
            {status:500}
        )
    }
}