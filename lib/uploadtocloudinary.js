export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "posture_unsigned"); // ensure this preset exists & is unsigned
  formData.append("folder", "posture-app");

  const res = await fetch("https://api.cloudinary.com/v1_1/dss7k4wej/video/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", errorText);
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  console.log("Uploaded video URL:", data.secure_url); // this should log a valid URL
  return data.secure_url;
};
