import User from "@models/User";
import { connectToDB } from "@mongodb";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { userId } = params;
    const body = await req.json();

    const { username, profileImage } = body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        username,
        profileImage,
      },
      { new: true }
    );

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update user", { status: 500 });
  }
};
