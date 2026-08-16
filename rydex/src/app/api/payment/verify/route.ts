import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { bookingId, razorpay_payment_id, razorpay_signature, razorpay_order_id } = await req.json()
        const crypto = require("crypto");
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "Invalid payment signature" }
            );
        }
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { success:false, message: "booking is not found." }
            )
        }
        const adminComission=booking.fare*0.10
        const partnerAmount=booking.fare-adminComission
        booking.adminComission=adminComission
        booking.partnerAmount=partnerAmount
        booking.paymentStatus="paid"
        booking.bookingStatus="confirmed"
        await booking.save()

        return NextResponse.json(
                { success:false, adminComission,partnerAmount},
                { status: 200 }
            )

    } catch (error) {
return NextResponse.json(
                { success:true, message: `verify paymnet error ${error}` },
                { status: 500 }
            )
    }
}