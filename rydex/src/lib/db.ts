import mongoose from "mongoose";

const mongodbUrl=process.env.MONGODB_URL


if(!mongodbUrl) {
    throw new Error("MONGODB_URL is not defined in the environment variables.");
}


let cached=global.mongooseConn
if(!cached) {
    cached=global.mongooseConn={conn:null,promise:null}
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUrl)
            .then((mongoose) => {
                console.log("MongoDB connected successfully");
                return mongoose.connection;
            });
    }

    try {
        const conn = await cached.promise;
        cached.conn = conn;
        return conn;
    } catch (error) {
        console.log("MongoDB connection error:", error);
        throw error;
    }
};

export default connectDb;