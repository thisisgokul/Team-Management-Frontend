
import  ProductAddForm  from '@/components/helpers/ProductAddForm'

import { ProductList } from '@/components/shared/ProductList'


export default function productsPage() {
  return (
   <>
    <ProductAddForm/>
    <section><ProductList/></section>
   </>
  )
}
