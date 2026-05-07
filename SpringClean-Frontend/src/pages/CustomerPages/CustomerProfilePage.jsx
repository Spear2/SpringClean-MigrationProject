import CustomerProfile from "../../components/CustomerProfilePage/CustomerProfilePage";
import HomeBar from "../../components/Navbar/NavBarCustomer";
import "../../CustomersStyles/CustomerProfilePage.css";

export default function CustomerProfilePage() {
  return (
    <>
      <HomeBar />
      <CustomerProfile />
    </>
  );
}
