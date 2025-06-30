import { useQuery } from "@tanstack/react-query";
import { authUserApi } from "../lib/api";

const useAuthUser = () =>{
    const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: authUserApi,
    retry: false
  })

  return {isLoading : authUser.isLoading , authUser :authUser.data?.user}
}
export default useAuthUser;