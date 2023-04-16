import supabase from "@/utils/supabaseClient";
import Image from "next/image";
import { useState } from "react";

export async function getServerSideProps({ params: { slug } }: any) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("name, id, profile_picture_url")
      .eq("id", slug);

    if (error) throw error;

    const { data: links, error: linksError } = await supabase
      .from("links")
      .select("title, url")
      .eq("user_id", user[0].id);

    if (linksError) throw linksError;

    return {
      props: {
        name: user[0].name,
        image: user[0].profile_picture_url,
        links,
        userId: user[0].id,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

function UserProfile({
  name,
  image,
  links,
  userId,
}: {
  name: string;
  image: string;
  links: { title: string; url: string }[];
  userId: string;
}) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <div>
        <div className="flex flex-col gap-4 mb-8">
          <div className="bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 border-2 border-black p-4 rounded relative">
            {name && image && (
              <div className="flex flex-col justify-center items-center">
                <Image
                  src={image}
                  alt="profile-picture"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <h1 className="mb-8 text-2xl font-bold">{name}</h1>
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
            )}
          </div>
          {links.map((link: any) => (
            <a
              href={link.url}
              key={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block text-center"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
