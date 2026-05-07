import CustomerWallets from "../../components/CustomerWallet/CustomerWallets";
import HomeBar from "../../components/Navbar/NavBarCustomer";
import "../../CustomersStyles/CustomerSettingsPage.css";

export default function CustomerSettingsPage() {
  return (
    <>
      <HomeBar />
      <CustomerWallets/>
    </>
  );
}
