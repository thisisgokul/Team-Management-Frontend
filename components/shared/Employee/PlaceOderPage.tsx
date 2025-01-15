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
import { Product } from "@/types";
import { OrderStatusDialog } from "@/components/helpers/OrderStatusDialog";


export function PlaceOderPage() {

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
           
             <OrderStatusDialog product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
     
    </Table>
  );
}
