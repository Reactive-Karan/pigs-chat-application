import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const POST = async (req, res, next) => {
  try {
    await connectToDB();
    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: [currentUserId],
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessage: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .populate({ path: "members", model: User })
      .exec();

    // Trigger Pusher event for a specific chat about the new message

    await pusherServer.trigger(chatId, "new-message", newMessage);

    // Triggers a Pusher event for each member of the chat about the the chat update with the latest message

    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member?._id.toString(), "chat-update", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.log(error);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });

    return new Response();
  } catch (error) {
    return new Response("Failed to send message", { status: 500 });
  }
};
