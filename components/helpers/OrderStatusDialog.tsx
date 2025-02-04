"use client";

import * as React from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger, Button, Input
} from "./UiImports";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { Product } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

// Define UserData interface
interface UserData {
  _id: string;
  fullName: string;
  email: string;
}

interface OrderStatusDialogProps {
  product: Product;
}

export function OrderStatusDialog({ product }: OrderStatusDialogProps) {
  const [customerName, setCustomerName] = React.useState("");
  const [orderStatus, setOrderStatus] = React.useState("Pending");
  const [userData, setUserData] = React.useState<UserData | null>(null);

  // Fetch user data from localStorage when the component mounts
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      console.error("Employee data not found");
    }
  }, []);

  const handleSubmit = async () => {
    if (!userData) {
      console.error("User data is not available");
      return;
    }

    const orderData = {
      customerName,
      orderStatus,
      productId: product._id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image,
      productDescription: product.description,
      employeeId: userData._id,
      employeeName: userData.fullName,
      employeeEmail: userData.email,
    };

    const toastId = toast.loading("Ordering...");
    try {
      await axiosInstance.post("/place-order", orderData, { withCredentials: true });
      toast.success("Order placed successfully! 🎉", { id: toastId });
      setCustomerName(""); // Clear customer name input
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-emerald-600">
          Place order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Order Status</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the customer name and select the order status.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Customer Name Input */}
          <div>
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input
              id="customer-name"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Order Status Select */}
          <div>
            <Label htmlFor="order-status">Order Status</Label>
            <Select onValueChange={setOrderStatus} value={orderStatus}>
              <SelectTrigger id="order-status">
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dialog Footer */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
