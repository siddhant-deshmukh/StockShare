import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"

function App() {
  const [signedIn, setSignedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // fetch()
  }, [])



  if (loading) {
    return (
      <>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </>
    )
  } else if (signedIn) {
    return (
      <>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </>
    )
  } else {
    return (
      <div className="flex items-center h-screen">
        <AuthForm />
      </div>
    )
  }
}


function AuthForm() {
  const [errMsg, setErrMsg] = useState<string>('')
  const [succMsg, setSuccMsg] = useState<string>('')
  const [authType, setAuthType] = useState<'Login' | 'Register'>('Register')

  const googleLogin = useGoogleLogin({
    onSuccess: (auth_res) => {
      const { code } = auth_res
      console.log("Sucessfully!", auth_res, code)
      fetch(`${import.meta.env.VITE_API_URL}/login-google`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      }).then((res) => {
        if (res.status !== 201) {
          throw 'Some error occured!'
        } else {
          return res.json()
        }
      })
        // .catch((err) => {
        //   setErrMsg('Google Authentication Failed! ' + JSON.stringify(err))
        //   alert('Google Login failed!  ')
        //   console.error("Error after onSucess callback ", err)
        // })
        .then((data) => {
          console.log('Here is the data', data)
          window.location.href = `${import.meta.env.BASE_URL}?redirect=google`
          //window.location.href = `${import.meta.env.BASE_URL}?redirect=google`
        })
        .catch((err) => {
          // alert('Google login failed!  '+ err)
          setErrMsg('Google Authentication Failed!')
          console.error("Error after onSucess callback ", err)
        })
    },
    onError: (res) => {
      console.error("error while login", res)
      alert('Google Login failed!  ')
      setErrMsg('Google Authentication Failed!')
    },
    flow: 'auth-code',
    redirect_uri: `${import.meta.env.BASE_URL.slice(0, -1)}?redirect=google`
  });


  return (
    <div className="w-[448px] max-w-full mx-auto border p-5 rounded-2xl shadow-lg  flex flex-col items-center space-y-5">
      <h1 className="text-2xl font-bold">StockShare</h1>
      { 
        authType === 'Register' &&
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="font-semibold pl-2 text-gray-700">Name :</label>
          <input id="name" placeholder="Enter your Name" className="p-3 rounded-full border-2 outline-none" />
        </div>
      }
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="font-semibold pl-2 text-gray-700">Email :</label>
        <input id="email" placeholder="Enter your Email" className="p-3 rounded-full border-2 outline-none" />
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="font-semibold pl-2 text-gray-700">Password :</label>
        <input id="password" placeholder="Enter your Password" className="p-3 rounded-full border-2 outline-none" />
      </div>

      {/* <div>
        <label htmlFor="name">Email :</label>
        <input id="email" placeholder="Enter Email" className=""/>
      </div>
      <div>
        <label htmlFor="name">Password :</label>
        <input id="password" placeholder="Enter Password" className=""/>
      </div> */}

      {
        authType === 'Register' &&
        <div className="text-center">
          Already Registered? <br />
          <button className="text-blue-700 font-semibold hover:underline" onClick={() => { setAuthType('Login') }}>Login</button>
        </div>
      }
      {
        authType === 'Login' &&
        <div className="text-center">
          Not Registered? <br />
          <button className="text-blue-700 font-semibold hover:underline" onClick={() => { setAuthType('Register') }}>Register</button>
        </div>
      }

      <div className="flex items-center w-full space-x-3">
        <div className="w-full h-0.5 bg-gray-700"></div>
        <span>OR</span>
        <div className="w-full h-0.5 bg-gray-700"></div>
      </div>

      <button
        onClick={() => googleLogin()}
        // disabled={renderProps.disabled} 
        className="group h-12 max-w-fit px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
        <div className="relative flex items-center space-x-4 justify-center">
          <img loading="lazy" src="https://tailus.io/sources/blocks/social/preview/images/google.svg" className="w-5 h-5" alt="google logo" />
          <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Google</span>
        </div>
      </button>
    </div>)
}
export default App
