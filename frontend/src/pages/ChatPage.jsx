import { useParams } from "react-router"
import { useEffect, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamTokenApi } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react'
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from '../components/ChatLoader.jsx'
import CallButton from '../components/CallButton.jsx'
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['getStreamToken'],
    queryFn: getStreamTokenApi,
    enabled: !!authUser // this is used to run only when authUser is available
  })
  console.log("authUser", authUser);
  console.log("tokenData", tokenData);
  console.log("STREAM_API_KEY", STREAM_API_KEY);

  console.log("Outside useEffect", { authUser, tokenData, targetUserId });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.streamToken || !authUser) {
        console.log("Missing token or authUser — skipping init");
        return;
      }

      try {
        console.log("Starting Stream init");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.streamToken
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Chat init error", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [authUser, tokenData, targetUserId]);



  if (loading || !chatClient || !channel) return <ChatLoader />;

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  }
  return (
    <div className="h-[93vh]" data-theme={"dark"}>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage