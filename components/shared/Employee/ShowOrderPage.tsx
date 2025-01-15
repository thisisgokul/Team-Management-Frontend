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
import useSWR from "swr";
import { Document } from "@/types";
import { useEffect, useState } from "react";

// Define a type for the user data
interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}
export function ShowOrderPage() {
  const [parsedUserData, setParsedUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData");
      const parsed = userData ? JSON.parse(userData) : null;
      setParsedUserData(parsed);
    }
  }, []); // Empty dependency array ensures it runs once when the component mounts

  // Ensure parsedUserData is available before making the API request
  const { data: products, isLoading } = useSWR<Document[]>(
    parsedUserData ? `/get-specific-products?userId=${parsedUserData._id}` : null,
    fetcher
  );

  // Show loader while fetching data
  if (isLoading) return <Loader />;

  // Show message if no products exist
  if (!products || products.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">No products found.</p>
      </div>
    );

  return (
    <Table>
      <TableCaption>A list of available products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Item Name</TableHead>
          <TableHead>Description</TableHead>
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
            <TableCell className="font-medium">{product.customerName}</TableCell>
            <TableCell className="font-medium">{product.productName}</TableCell>
            <TableCell>{product.productDescription}</TableCell>
            <TableCell className="text-right">${product.productPrice.toFixed(2)}</TableCell>
            <TableCell className="text-right space-x-2">
              {product.orderStatus}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
