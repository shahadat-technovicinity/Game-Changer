import mongoose from "mongoose";

const connect = async (db: string) => {
  await mongoose.connect(db);
};

export { connect };
