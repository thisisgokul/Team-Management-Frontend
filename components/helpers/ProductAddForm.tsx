"use client";

// Imports
import { useState, useEffect } from "react";
import useSWR from "swr";
import {  
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
    AlertDialogTitle, AlertDialogTrigger, Button, Input
} from "./UiImports";
import { handleCreateProducts } from "@/utils/apis/handleCreateProducts";
import { AddProductProps, ProductData } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

export default function AddProducts({ id }: AddProductProps) {
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  // Use SWR to fetch product data if ID is provided (edit mode)
  const { data: product, isLoading } = useSWR<ProductData>(
    id ? `/get-product/${id}` : null, 
    fetcher
  );

  // Update form data when product data is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        image: product.image || "",
      });
    }
  }, [product]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  // Handle image upload and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prevState) => ({
            ...prevState,
            image: reader.result as string, 
          }));
        }
      };
  
      reader.onerror = (error) => {
        console.error("Error reading file: ", error);
      };
    }
  };
  
  
  // Handle form submission
  const handleSubmit = async () => {
    await handleCreateProducts(formData, setFormData, id);
  };

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      {id ? (
        <Button variant="outline" size="sm" className="mr-2">
          Edit
        </Button>
      ) : (
        <Button className="w-auto max-w-fit ml-auto">ADD PRODUCT</Button>
      )}
    </AlertDialogTrigger>
    <AlertDialogContent className="w-[600px] max-w-full"> {/* Increase dialog width */}
      <AlertDialogHeader>
        <AlertDialogTitle>{id ? "Edit Product" : "Create Product"}</AlertDialogTitle>
        <AlertDialogDescription>
          {id ? "Update the details of the product." : "Please fill in the details to create a new product."}
        </AlertDialogDescription>
      </AlertDialogHeader>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
  <div className="flex flex-col">
    <Input
      required
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      placeholder="Enter product name"
    />
    {formData.image && (
      <img src={formData.image} alt="Selected" className="mt-2 w-full h-32 object-cover rounded-md" />
    )}
  </div>
  <div className="sm:col-span-2"> {/* Make description input take full width */}
    <textarea
      required
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      placeholder="Enter product description"
      className="w-full h-40 p-2 border border-gray-300 rounded-lg"
    />
  </div>
</div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              required
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              type="number"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
           
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
