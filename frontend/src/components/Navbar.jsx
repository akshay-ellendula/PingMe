import toast from "react-hot-toast";
import { logoutApi } from "../lib/api.js";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MessageCircle } from "lucide-react";
import ThemeButton from "./ThemeButton.jsx";



function Navbar() {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const queryClient = useQueryClient();
  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        toast.success("logout successfully")
    }
  })
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky  top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          <div className="flex lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <MessageCircle className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                PingMe
              </span>
            </Link>
          </div>


          <div className="flex items-center gap-3 sm:gap-4 ml-auto p-1">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle ">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {!isChatPage &&
            <div className="p-2 flex items-center gap-3">
              <ThemeButton />
            </div>
          }
          <div className="avatar p-1">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <div className="p-2">
            <button className="btn btn-ghost btn-circle " onClick={logoutMutation}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar