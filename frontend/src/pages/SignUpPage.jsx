import { useState } from "react"
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { signupApi } from "../lib/api.js"

function SignUpPage() {

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const queryClient = useQueryClient()

  const { mutate: signupMutate, isPending, error } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
  })

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutate(signUpData);
  }



  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* this is for left box */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageCircle className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              PingMe
            </span>
          </div>
          {
            error && (
              <div className="alert alert-error mb-4">
                <span>
                  {error.response.data.message}
                </span>
              </div>
            )
          }
          <div className="w-full">

            <form onSubmit={handleSignup}>

              <div className="space-y-4">

                <div>
                  <h2 className="text-xl font-bold">Create account</h2>
                  <p className="text-sm opacity-80">Join Ping me</p>
                </div>

                <div className="space-y-3">
                  {/* full name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Akshay Ellendula"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  {/* email*/}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="akshayellendula@gmail.com"
                      className="input input-bordered w-full"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">
                        Password
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="*******"
                      className="input input-bordered w-full"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>

                  <button className=" btn btn-primary w-full" type="submit">
                    {isPending ?
                      <>
                        <span className=" loading loading-spinner loading-xl">
                        </span>
                        loading
                      </> : "Create Account"}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>


      </div>

    </div>
  )
}

export default SignUpPage