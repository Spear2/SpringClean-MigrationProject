import CustomerSettings from "../../components/CustomerSetttingsPage/CustomerSettings";
import HomeBar from "../../components/Navbar/NavBarCustomer";
import "../../CustomersStyles/CustomerSettingsPage.css";

export default function CustomerSettingsPage() {
  return (
    <>
      <HomeBar />
      <CustomerSettings />
    </>
  );
}
