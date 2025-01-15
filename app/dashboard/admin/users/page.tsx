import { AddMembers } from "@/components/shared/Add-members";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { UserTable } from "@/components/shared/User-table";


export default function page() {

    // const userData = localStorage.getItem("userData");

    // // If you stored the data as a JSON string, you may need to parse it back into an object
    // const parsedUserData = userData ? JSON.parse(userData) : null;
    
    // // Now you can use the parsedUserData
    // console.log(parsedUserData.fullName);
    

  
  return (
    <DashboardLayout>
    {/* Component for adding a new team member */}
    <AddMembers />
    
    {/* List of all team members and their management options */}
    <section>
      <UserTable />
    </section>
  </DashboardLayout>
  
  );
}
