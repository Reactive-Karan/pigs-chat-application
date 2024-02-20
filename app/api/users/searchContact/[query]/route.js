const { default: User } = require("@models/User");
const { connectToDB } = require("@mongodb");

export const GET = async (req, { params }) => {
  try {
    connectToDB();
    const { query } = params;

    const searchedContacts = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(searchedContacts), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to search for contacts", { status: 500 });
  }
};
