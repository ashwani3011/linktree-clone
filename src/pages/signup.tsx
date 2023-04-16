import supabase from "@/utils/supabaseClient";
import { ReactEventHandler, useState } from "react";
import Router from "next/router";

function Signup() {
  const [email, setEmail] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup();
  };

  const signup = async () => {
    try {
      if (email && password) {
        const response = await supabase.auth.signUp({ email, password });
        if (response.error) throw response.error;

        const userId = response.data.user?.id;

        await supabase.from("users").insert({ id: userId, name: username });

        Router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        background: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)",
      }}
    >
      <div className="bg-white p-12 rounded-lg w-4/6 max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif text-center">
          Sign up now and start showcasing your online presence!
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-8">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
