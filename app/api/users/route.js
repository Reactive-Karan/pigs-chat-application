import User from "@models/User";
import { connectToDB } from "@mongodb";

export const GET = async (req, res) => {
  try {
    await connectToDB();

    const allUsers = await User.find({});

    return new Response(JSON.stringify(allUsers), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch users", { status: 500 });
  }
};
