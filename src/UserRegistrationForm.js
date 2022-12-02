import { useState } from "react"

export const UserRegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [postcode, setPostcode] = useState("");

  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [postcodeInvalid, setPostcodeInvalid] = useState(false);

  const [userCreated, setUserCreated] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState(false);

  const createUser = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      postcode: postcode.toUpperCase()
    }
    return JSON.stringify(user);
  }

  const saveUser = () => {
    setDuplicateEmail(false)
    setUserCreated(false)
    if (inputValid()) {
      const res = fetch("http://127.0.0.1:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: createUser(),
      })
      res.then((res) => {
        if (res.status == 200) {
          setUserCreated(true);
          setName("")
          setEmail("")
          setPassword("")
          setPostcode("")
        } else if (res.status == 500) {
          setDuplicateEmail(true);
        }
      })
    }
  }


  const inputValid = () => {
    setPasswordInvalid(false);
    setEmailInvalid(false);
    setPostcodeInvalid(false);
    let errors = false;
    if (!validPassword(password)) {
      setPasswordInvalid(true);
      errors = true;
    }
    if (postcode.length > 0 && !validPostcode(postcode)) {
      setPostcodeInvalid(true);
      errors = true;
    }
    if (email.length == 0 || !validEmail(email)) {
      setEmailInvalid(true)
      errors = true;
    }
    return !errors;
  }

  const validPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return regex.test(password);
  }

  const validEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  const validPostcode = (postcode) => {
    postcode = postcode.replace(/\s/g, "").toUpperCase();
    const regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
    return regex.test(postcode);
  }

  return (
    <div className="mb-10">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Register here
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 mt-5">
        Complete the form to sign up {' '}
      </p>
      {duplicateEmail &&
        <h2 className="mt-6 text-center text-3xl font-extrabold text-orange-400">
          This email has already registered
        </h2>
      }
      {userCreated &&
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-400">
          Thanks for registering!
        </h2>
      }
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name (optional)
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailInvalid && <p className="text-red-500 text-xs italic">Please enter a valid email.</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="************" value={password} onChange={(e) => setPassword(e.target.value)} />
          {passwordInvalid && <p className="text-red-500 text-xs italic">Please enter a password which contains a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number.</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postcode">
            Postcode (optional)
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="postcode" type="text" placeholder="postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
          {postcodeInvalid && <p className="text-orange-500 text-xs italic">The postcode you have entered is invalid.</p>}
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={saveUser}>
            Register
          </button>
        </div>
      </form>
    </div>
  )
}