import { useGoogleLogin } from "@react-oauth/google"
import { useCallback, useContext, useRef, useState } from "react"
import { AppContext } from "./AuthContext"

function App() {

  const { authLoading, authState, setAuthState } = useContext(AppContext)

  if (authLoading) {
    return (
      <div className="flex h-screen items-center place-content-center">
        <div
          className="inline-block h-14 w-14 animate-spin border-blue-400 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
          >
        </div>
      </div>
    )
  } else if (authState) {
    return (
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
          {
            JSON.stringify(authState)
          }
        </h1>
        <button onClick={(event) => {
          event.preventDefault()
          fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            credentials: 'include'
          }).then(() => {
            setAuthState(null)
          }).catch((err) => {
            console.error('While loggin out', err)
          })
        }}>
          Logout
        </button>
      </div>
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

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  const { setAuthState } = useContext(AppContext)

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
          // window.location.href = `${import.meta.env.BASE_URL}?redirect=google`
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

  const BtnOnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()

    let name = nameRef.current?.value
    let email = emailRef.current?.value
    let password = passwordRef.current?.value

    console.log(nameRef.current, emailRef.current, name, email, password)

    if (!email || !password) {
      setErrMsg('Please enter email and password')
      return
    }
    if (!name && authType === 'Register') {
      setErrMsg('Name require for registeration')
      return
    }
    if (password.length < 5) {
      setErrMsg('Password must be longer than 5 characters')
      return
    }
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setErrMsg('Enter valid email')
      return
    }

    if (authType === 'Login') {
      fetch(`${import.meta.env.VITE_API_URL}/login-password`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, password
        })
      }).then((res) => res.json())
        .then((data) => {
          console.log("After login password data", data.user)
          if (data && data.user && data.user._id) {
            console.log("After login password data", data.user)
            setAuthState(data.user)
          }
        })
        .catch((error) => {
          console.error("Some error occured!", error)
        })
    } else {
      if (!name || name.length < 4) {
        setErrMsg('Length of Name should be atleast 4')
        return
      }
      fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, email, password
        })
      }).then((res) => res.json())
        .then((data) => {
          console.log("After register password data", data)
          if (data && data.user && data.user._id) {
            console.log("After register password data", data.user)
            setAuthState(data.user)
          }else if(data && data.msg){
            setErrMsg(data.msg)
          }
        })
        .catch((error) => {
          console.error("Some error occured!", error)
        })
    }
  }, [authType])

  return (
    <div className="w-[448px] max-w-full mx-auto border p-5 rounded-2xl shadow-lg  flex flex-col items-center space-y-5">
      <h1 className="text-2xl font-bold">StockShare</h1>

      {
        errMsg && errMsg.length > 0 && <div
          className="w-full rounded-lg flex items-center justify-between bg-red-100 pl-5 pr-3 py-1 text-base text-red-700"
          role="alert">
          <span>{errMsg}</span>
          <button
            onClick={(event) => { event.preventDefault(); setErrMsg('') }}
            className="px-2.5 py-1.5 rounded-full hover:bg-red-200">X</button>
        </div>
      }
      {
        succMsg && succMsg.length > 0 && <div>

        </div>
      }

      {
        authType === 'Register' &&
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="font-semibold pl-2 text-gray-700">Name :</label>
          <input id="name" type="text" ref={nameRef} placeholder="Enter your Name" className="p-3 rounded-full border-2 outline-none" />
        </div>
      }
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="font-semibold pl-2 text-gray-700">Email :</label>
        <input id="email" type="email" ref={emailRef} placeholder="Enter your Email" className="p-3 rounded-full border-2 outline-none" />
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="font-semibold pl-2 text-gray-700">Password :</label>
        <input id="password" type="password" ref={passwordRef} placeholder="Enter your Password" className="p-3 rounded-full border-2 outline-none" />
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
        <button
          type="button"
          onClick={BtnOnClickHandler}
          className="inline-block rounded-xl bg-blue-500 px-6 pb-2 pt-2.5 font-semibold uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
          Register
        </button>
      }
      {
        authType === 'Login' &&
        <button
          type="button"
          onClick={BtnOnClickHandler}
          className="inline-block rounded-xl bg-blue-500 px-6 pb-2 pt-2.5 font-semibold uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
          Login
        </button>
      }

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
        className="group h-12 max-w-fit px-6 border-2 border-blue-200 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
        <div className="relative flex items-center space-x-4 justify-center">
          <img loading="lazy" src="https://tailus.io/sources/blocks/social/preview/images/google.svg" className="w-5 h-5" alt="google logo" />
          <span className="block w-max font-semibold tracking-wide text-blue-500 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Google</span>
        </div>
      </button>
    </div>)
}
export default App
