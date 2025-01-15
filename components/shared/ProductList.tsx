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
import { Button } from "@/components/ui/button";

import { Loader } from "@/utils/constants";
import { fetcher } from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { Product } from "@/types";
import AddProducts from "../helpers/ProductAddForm";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";




export function ProductList() {

  const { data: products, isLoading } = useSWR<Product[]>(
    "/get-all-product",
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

   // function for delete a product
   const handleDeleteProduct = async (id: string | undefined) => {
    if (!id) return;
  
    
    try {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );
        if (!confirmed) return;
        
    const toastId = toast.loading("Deleting..."); // Show loading toast
      await axiosInstance.delete(`/delete-product/${id}`, {
        withCredentials: true,
      });
  
      toast.success("Product deleted successfully!", { id: toastId }); // Replace loading with success
      mutate("/get-all-product"); // Refetch product list
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product."); // Replace loading with error
    }
  };
  

  return (
    <Table>
      <TableCaption>A list of available products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
            <TableCell className="text-right space-x-2">
             <AddProducts id={product._id}/>
             <Button
                onClick={() => handleDeleteProduct(product._id)}
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
     
    </Table>
  );
}
