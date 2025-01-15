import  ProductAddForm  from '@/components/helpers/ProductAddForm'
import DashboardLayout from '@/components/shared/DashboardLayout'
import { ProductList } from '@/components/shared/ProductList'
import React from 'react'

export default function productsPage() {
  return (
   <DashboardLayout>
    <ProductAddForm/>
    <section><ProductList/></section>
   </DashboardLayout>
  )
}
