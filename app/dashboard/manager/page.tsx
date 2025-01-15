import DashboardLayout from '@/components/shared/DashboardLayout'
import {GetAllOrders} from '@/components/shared/Manager/GetAllOrders'
import React from 'react'

function MangerPage() {
  return (
    <DashboardLayout>
<GetAllOrders/>
    </DashboardLayout>
  )
}

export default MangerPage
