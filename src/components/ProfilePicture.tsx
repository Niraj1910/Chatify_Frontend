import { CiCamera } from "react-icons/ci";

interface ProfilePictureProps {
  imagePreview: string | undefined;
  setImagePreview: (arg: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imagePreview,
  setImagePreview,
  fileInputRef,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* User Avatar Image */}
      <img
        src={imagePreview}
        alt="User Avatar"
        className="w-40 h-40 rounded-full "
      />

      {/* Camera Icon */}
      <div
        className="absolute bottom-0 right-32 bg-black text-white p-2 rounded-full cursor-pointer"
        onClick={handleImageClick}
      >
        <CiCamera className="w-6 h-6 font-semibold" />
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        name="avatar"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePicture;
