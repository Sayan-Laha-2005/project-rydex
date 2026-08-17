import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { latitude, longitude, vehicleType } = await req.json()
        if (!latitude || !longitude) {
            return NextResponse.json(
                { message: "latitude and longitude not found" }, { status: 400 })
        }
        const partners = await User.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: 5000
                }
            }
        })



        const partnerIds = partners.map(p => p._id)


        if (partnerIds.length == 0) {
            return NextResponse.json(
                [],
                { status: 200 })
        }


        const vehicles = await Vehicle.find({
            owner: { $in: partnerIds },
            type: vehicleType,
            status: "approved",
            isActive: true
        }).lean()

        return NextResponse.json(vehicles, { status: 200 })



    } catch (err) {
        return NextResponse.json(
            { message: `near by vehicles error: ${err}` },
            { status: 500 })
    }

}
