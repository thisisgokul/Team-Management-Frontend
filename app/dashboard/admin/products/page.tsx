import  ProductAddForm  from '@/components/helpers/ProductAddForm'
import DashboardLayout from '@/components/shared/DashboardLayout'
import { ProductList } from '@/components/shared/ProductList'


export default function productsPage() {
  return (
   <DashboardLayout>
    <ProductAddForm/>
    <section><ProductList/></section>
   </DashboardLayout>
  )
}
