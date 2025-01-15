"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import { Loader } from "@/utils/constants";
import { fetcher } from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { Document } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";



export function GetAllOrders() {
       
    
    
  const { data: products, isLoading } = useSWR<Document[]>(
    `/get-all-orders`,
    fetcher
  );

  // Show loader while fetching data
  if (isLoading) return <Loader/>;

  // Show message if no products exist
  if (!products || products.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">No products found.</p>
      </div>
    );

    const handleStatusChange = async (id: string, newStatus: string) => {
      
        try {
            const toastId = toast.loading("Updating...");
          // Update the order status in the backend using Axios
            await axiosInstance.put(`/update-order-status/${id}`, {
            orderStatus: newStatus,
          },{withCredentials:true});
          toast.success("Order updated successfully! 🎉",{id:toastId});
          // Re-fetch the data after successful update
          mutate("/get-all-orders", undefined, { revalidate: true }); 
            
         
        } catch (error) {
          console.error("Error updating order status", error);
        } finally {
        
        }
      };
   

  return (
    <Table>
    
      <TableCaption>A list of Orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Item Name</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Added by</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>
              <Image
                src={product.productImage}
                alt={product.productName}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{product.productName}</TableCell>
            <TableCell className="font-medium">{product.customerName}</TableCell>
            <TableCell>{product.productDescription}</TableCell>
            <TableCell>{product.employeeName}</TableCell>
            
            <TableCell className="text-right">${product.productPrice.toFixed(2)}</TableCell>
            <TableCell className="text-right space-x-2">
            <select
                value={product.orderStatus}
                onChange={(e) => handleStatusChange(product._id, e.target.value)}
                className="px-2 py-1 border rounded-md"
                
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>    
             </TableCell>
          </TableRow>
        ))}
      </TableBody>
     
    </Table>
  );
}
