import axiosInstance from "@/utils/axiosInstance";
import { ProductData } from "@/types";
import { toast } from "sonner";
import { mutate } from "swr";

export const handleCreateProducts = async (
  formData: ProductData,
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>,
  id?: string
) => {
  const toastId = toast.loading(id ? "Updating..." : "Creating..."); // Show loading toast

  try {
    if (id) {
      // Update existing product
      await axiosInstance.put(`/update-product/${id}`, formData, {
        withCredentials: true,
      });
      toast.success("Product updated successfully!", { id: toastId }); // Replace loading with success
    } else {
      // Create new product
      await axiosInstance.post("/create-product", formData, {
        withCredentials: true,    
      });
      toast.success("Product created successfully!", { id: toastId }); // Replace loading with success
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
      });
    }

    // Mutate data to trigger re-fetch
    mutate("/get-all-product");
  } catch (error) {
    console.error("Error creating/updating product", error);
    toast.error("An error occurred. Please try again.", { id: toastId }); // Show error toast
  }
};
