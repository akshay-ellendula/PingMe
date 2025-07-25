import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamTokenApi } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoading from "../components/PageLoading.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamTokenApi,
    enabled: !!authUser,
  });
useEffect(() => {
  let videoClient;
  let callInstance;

  const initCall = async () => {
    if (!tokenData?.streamToken || !authUser || !callId) return;

    try {
      const user = {
        id: authUser._id,
        name: authUser.fullName,
        image: authUser.profilePic,
      };

      videoClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user,
        token: tokenData.streamToken,
      });

      callInstance = videoClient.call("default", callId);
      await callInstance.join({ create: true });

      setClient(videoClient);
      setCall(callInstance);
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Could not join the call. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  initCall();

  return () => {
    if (callInstance) callInstance.leave();
    if (videoClient) videoClient.disconnectUser();
  };
}, [tokenData, authUser, callId]);


  if (isLoading || isConnecting) return <PageLoading />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;