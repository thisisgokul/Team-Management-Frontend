"use client";

import {
  Table,TableBody,TableCaption,TableCell,
  TableFooter,TableHead,TableHeader,TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import axiosInstance from "@/utils/axiosInstance";
import { userData } from "@/types";
import { Loader } from "@/utils/constants";
import { AddMembers } from "./Add-members";
import { toast } from "sonner";

// Fetch function for SWR
const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

export function UserTable() {
  const { data: users, isLoading } = useSWR<userData[]>(
    "/get-all-users",
    fetcher
  );

  // Show loader while fetching data
  if (isLoading) return <Loader />;

  // Show message if no users exist
  if (!users || users.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">No users found.</p>
      </div>
    );
  // function for delete a user
  const handleDeleteUser = async (id: string | undefined) => {
    if (!id) return;

    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmed) return;

      await axiosInstance.delete(`/delete-user/${id}`, {
        withCredentials: true,
      });

      toast.success("User deleted successfully!");
      mutate("/get-all-users"); // Refetch user list
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <Table>
      <TableCaption>List of team members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(({ _id, fullName, email, role }) => (
          <TableRow key={_id}>
            <TableCell className="font-medium">{fullName}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell className="text-right">
              {/* add edit members */}
              <AddMembers id={_id} />

              {/* Delete user */}
              <Button
                onClick={() => handleDeleteUser(_id)}
                variant="outline"
                size="sm"
                className="text-red-500"
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Users</TableCell>
          <TableCell className="text-right">{users.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
