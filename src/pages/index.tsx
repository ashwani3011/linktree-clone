import AddNewLink from "@/components/AddNewLink";
import supabase from "@/utils/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import RenderLinks from "@/components/RenderLinks";
import ProfilePicture from "@/components/ProfilePicture";
import { useRouter } from "next/router";
import Image from "next/image";

export type Link = {
  title: string;
  url: string;
  id: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [links, setLinks] = useState<Link[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  async function handleAddNewLink(newLink: Link) {
    const { data, error } = await supabase
      .from("links")
      .insert({
        title: newLink.title,
        url: newLink.url,
        user_id: userId,
      })
      .select();
    setLinks([...links, newLink]);
  }

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        setUserId(user.data.user?.id);
        setIsAuthenticated(true);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    (async function () {
      const { data } = await supabase
        .from("users")
        .select("name, profile_picture_url")
        .eq("id", userId);
      if (data) {
        setUsername(data[0]["name"]);
        setProfilePicture(data[0]["profile_picture_url"]);
      }
    })();
  }, [userId, profilePicture, username]);

  useEffect(() => {
    try {
      const getLinks = async () => {
        const { data, error } = await supabase
          .from("links")
          .select("title, url, id")
          .eq("user_id", userId);
        if (error) throw error;

        setLinks(data);
      };
      getLinks();
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  async function signout() {
    await supabase.auth.signOut();
    setUserId(undefined);
    setIsAuthenticated(false);
  }

  return (
    <div className="flex justify-center items-center">
      {isAuthenticated && userId ? (
        <div className="flex flex-col gap-4">
          {username ? (
            <div className="bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 border-2 border-black p-4 rounded relative">
              <div className="flex flex-col justify-center items-center gap-2">
                <Image
                  src={
                    profilePicture ||
                    "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_960_720.png"
                  }
                  alt="profile-picture"
                  width={100}
                  height={100}
                  className="rounded-full"
                />

                <ProfilePicture user_id={userId} />
                <h1 className="text-2xl font-bold pb-4">Hello 👋 {username}</h1>
                <div className="bg-gray-200 rounded font-semibold pl-1">
                  Profile URL:{" "}
                  <a href={profileUrl}>{profileUrl.substring(0, 20)}...</a>
                  <button
                    onClick={handleCopyLink}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isCopied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              <button
                onClick={signout}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline absolute top-0 right-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <h1>Loading...</h1>
          )}
          <AddNewLink addNewLink={handleAddNewLink} />
          <RenderLinks links={links} />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center min-h-screen w-full"
          style={{
            background: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)",
          }}
        >
          <div className="bg-white p-12 rounded-lg w-4/6 max-w-4xl flex flex-col items-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-8 font-serif text-center">
              Welcome to MyLinkTree
            </h1>
            <div className="flex space-x-4">
              <Link href="/login">
                <span className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 font-bold">
                  Login
                </span>
              </Link>
              <Link href="/signup">
                <span className="px-6 py-3 bg-transparent border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-200 font-bold">
                  Signup
                </span>
              </Link>
            </div>
            <p className="text-gray-800 mt-8 text-center max-w-md">
              MyLinkTree is a platform that allows you to create a personalized
              link page to showcase your social media profiles, portfolio, or
              any other online presence you have. Sign up now to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
