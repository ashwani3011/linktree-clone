import supabase from "@/utils/supabaseClient";
import { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

function ProfilePicture({ user_id }: { user_id: string }) {
  const [image, setImage] = useState<ImageListType>([]);

  const onChange = (imageList: ImageListType) => {
    setImage(imageList);
  };

  const uploadProfilePicture = async () => {
    try {
      if (image) {
        if (image[0].file && user_id) {
          const { data, error } = await supabase.storage
            .from("public")
            .upload(`${user_id}/${image[0].file.name}`, image[0].file, {
              upsert: true,
            });

          if (error) throw error;
          const profilePictureUrl = supabase.storage
            .from("public")
            .getPublicUrl(data.path);

          const profilePicturePublicUrl = profilePictureUrl.data.publicUrl;

          await supabase
            .from("users")
            .update({ profile_picture_url: profilePicturePublicUrl })
            .eq("id", user_id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ImageUploading
        multiple
        value={image}
        onChange={onChange}
        maxNumber={1}
        dataURLKey="data_url"
      >
        {({ onImageUpload }) => (
          <div>
            {image[0] && image[0]["data_url"] && (
              <div>
                <img src={image[0]["data_url"]} alt="" width="100" />
              </div>
            )}

            {image[0] && image[0]["data_url"] ? (
              <button
                onClick={uploadProfilePicture}
                className="bg-orange-500 hover:orange-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline cursor-pointer"
              >
                Upload avatar
              </button>
            ) : (
              <button
                onClick={onImageUpload}
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline cursor-pointer"
              >
                Change avatar
              </button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default ProfilePicture;
