import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await context.params).id
        await connectDb()

        const booking = await Booking.findById(id)

        if (!booking || booking.bookingStatus !== "requested") {
            return NextResponse.json(
                { message: "invalid" },
                { status: 400 }
            )
        }

        booking.bookingStatus = "awaiting_payment"
        booking.paymentDeadline = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()

        return NextResponse.json(
            { success: "true" },
            { status: 200 }
        )


    } catch (error) {
        return NextResponse.json(
            { message: `accept booking error ${error}` },
            { status: 500 }
        )
    }
}