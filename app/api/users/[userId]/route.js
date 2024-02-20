const { default: Message } = require("@models/Message");
const { default: Chat } = require("@models/Chat");
const { default: User } = require("@models/User");
const { connectToDB } = require("@mongodb");

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { userId } = params;

    const allChats = await Chat.find({ members: userId })
      .sort({
        lastMessage: -1,
      })
      .populate({ path: "members", model: User })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })

      .exec();

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all chats", { status: 500 });
  }
};
