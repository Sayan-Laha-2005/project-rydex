import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "unauthorized" }, { status: 400 })
        }

        const {reason}=await req.json()


        const { id } = await context.params
        const vehicleId = id
        const vehicle = await Vehicle.findById(vehicleId)

        if (!vehicle) {
            return Response.json(
                { message: "vehicle not found" },
                { status: 400 }
            )
        }

        vehicle.status = "rejected"
        vehicle.rejectionReason = reason
        await vehicle.save()

        return Response.json(
            vehicle,
            { status: 200 }
        )
    }
    catch (error) {
        return Response.json(
            { message: `vehicle reject error ${error}` },
            { status: 500 }
        )
    }
}
