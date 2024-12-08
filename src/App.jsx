import { Route, Routes } from 'react-router-dom';
import { EmployeeAuthProvider } from './AuthContext/EmployeeAuthContext';
import { CustomerAuthProvider } from './AuthContext/CustomerAuthContext';
import CustomerRoutes from './pages/customer/Customer.Routes';


function App() {
  return (
      <CustomerAuthProvider>
        <EmployeeAuthProvider>
          <Routes>
            <Route path="/*" element={<CustomerRoutes />} />
          </Routes>
        </EmployeeAuthProvider>
      </CustomerAuthProvider>
  );
}

export default App;
