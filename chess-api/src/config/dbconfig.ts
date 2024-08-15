import mongoose from "mongoose";

const connectToDb = async (uri: string, dbName: string) => {
  try {
    await mongoose.connect(uri, { dbName: dbName });
    console.log("connected to database");
  } catch (error) {
    console.log("Error connecting to database :", error);
    process.exit(1);
  }
};

export default connectToDb;
