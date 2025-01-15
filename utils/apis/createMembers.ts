import { userData } from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "sonner";
import { mutate } from "swr";

export const handleCreateMembers = async (
  formData: userData,
  setFormData: React.Dispatch<React.SetStateAction<userData>>,
  id?: string // Optional ID for updating

) => {
  try {
    if (
      !formData.fullName ||
      !formData.email ||
      (!id && !formData.password) ||
      !formData.role
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    let response;
    if (id) {
      // If ID exists, update the team member
      response = await axiosInstance.put(
        `/update-team-member/${id}`,
        formData,
        { withCredentials: true }
      );
      toast.success("Team member updated successfully!");
    } else {
      // If no ID, create a new team member
      response = await axiosInstance.post("/create-team-member", formData, {
        withCredentials: true,
      });
      toast.success("Team member created successfully!");
      // Reset form data after successful operation
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
      });
    }

    mutate('/get-all-users')
    return response.data;
  } catch (error: any) {
    console.error("Error handling team member:", error);
    toast.error(error.response?.data?.message || "An error occurred");
  }
};
