"use client";

// Imports
import { useState, useEffect } from "react";
import useSWR from "swr";
import {  
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
    AlertDialogTitle, AlertDialogTrigger, Button, Input, 
    Select, SelectItem, SelectTrigger, SelectValue, SelectContent 
} from "./UiImports";
import { handleCreateMembers } from "@/utils/apis/createMembers";
import { AddMembersProps, userData } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

export function AddMembers({ id }: AddMembersProps) {
  const [formData, setFormData] = useState<userData>({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  // Use SWR to fetch user data if ID is provided (edit mode)
  const { data: user, isLoading } = useSWR<userData>(
    id ? `/get-user/${id}` : null, 
    fetcher
  );

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "", // Keep password empty for security reasons
        role: user.role || "",
      });
    }
  }, [user]);

  // Handle role change
  const handleRoleChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      role: value,
    }));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    await handleCreateMembers(formData, setFormData,id);

  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {id ? (
          <Button variant="outline" size="sm" className="mr-2">
            Edit
          </Button>
        ) : (
          <Button className="w-auto max-w-fit ml-auto">ADD TEAM MEMBER</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{id ? "Edit Teammate" : "Create Teammate"}</AlertDialogTitle>
          <AlertDialogDescription>
            {id ? "Update the details of the teammate." : "Please fill in the details to create a new teammate."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input 
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name" 
              />
              <Input 
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email" 
                type="email" 
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {!id && ( // Hide password field when editing user
                <Input 
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password" 
                  type="password" 
                />
              )}
              <div>
                <Select onValueChange={handleRoleChange} value={formData.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {id ? "Update" : "Create"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
