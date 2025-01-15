import { ScopedMutator } from "swr";

export type userData = {
  _id?:string;
    fullName: string;
    email: string;
    password: string;
    role: string;
  };

  export type AddMembersProps = {
    id?: string;
    mutate?: any;
  };

export interface ProductData {
  name: string;
  description: string;
  price: string;
  image: string| null;
}

export interface AddProductProps {
  id?: string; 
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface  Document {
  _id:string
  customerName: string;
  orderStatus: "Pending" | "Delivered" | "Cancelled";
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productDescription: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  createdAt: Date;
}
