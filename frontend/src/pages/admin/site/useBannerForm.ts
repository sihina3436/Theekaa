import { useState, useRef } from "react";
import { UploadImageResponse, CreateBannerPayload } from "./bannerTheme";

type UploadFn = (formData: FormData) => { unwrap: () => Promise<UploadImageResponse> };
type SubmitFn = (payload: CreateBannerPayload) => { unwrap: () => Promise<any> };

interface UseBannerFormOptions {
  uploadFn: UploadFn;
  submitFn: SubmitFn;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  successMsg: string;
  errorMsg: string;
}

const useBannerForm = ({
  uploadFn,
  submitFn,
  onSuccess,
  onError,
  successMsg,
  errorMsg,
}: UseBannerFormOptions) => {
  const [bannerTitle,  setBannerTitle]  = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl,  setUploadedUrl]  = useState<string | null>(null);
  const [isUploading,  setIsUploading]  = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setBannerTitle(""); setImagePreview(null); setUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { onError("Only image files allowed"); return; }
    if (file.size > 5 * 1024 * 1024)    { onError("Max size is 5 MB");         return; }

    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadFn(formData).unwrap();
      setUploadedUrl(res.imageUrl);
    } catch {
      setImagePreview(null);
      onError("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) { onError("Banner title is required");        return; }
    if (!uploadedUrl)        { onError("Please wait for image to upload"); return; }

    setIsSubmitting(true);
    try {
      await submitFn({ bannerTitle: bannerTitle.trim(), bannerImageUrl: uploadedUrl }).unwrap();
      onSuccess(successMsg);
      reset();
    } catch {
      onError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRemove = () => {
    setImagePreview(null); setUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    bannerTitle, setBannerTitle,
    imagePreview, uploadedUrl,
    isUploading, isSubmitting,
    fileInputRef,
    handleImageChange, handleSubmit, onRemove,
  };
};

export default useBannerForm;
