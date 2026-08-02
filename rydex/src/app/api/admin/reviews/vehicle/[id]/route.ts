import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
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
        const vehicleId = id
        const vehicle = await Vehicle.findById(vehicleId).populate("owner")

        if (!vehicle) {
            return Response.json(
                { message: "vehicle not found" },
                { status: 400 }
            )
        }

        return Response.json(
                vehicle,
                { status: 200 }
            )


    } catch (error) {
        return Response.json(
                { message: `vehicle review get error ${error}` },
                { status: 500 }
            )

    }

}