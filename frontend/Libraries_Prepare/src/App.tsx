
import { type Payment } from "./components/paymentsTable/columns";
import DataTable from "./components/paymentsTable/DataTable";
import { columns } from "./components/paymentsTable/columns";
const App = () => {
  const payments: Payment[] = [
    {
      id: "a1b2c3d4",
      amount: 250,
      status: "success",
      email: "john.doe@example.com",
    },
    {
      id: "e5f6g7h8",
      amount: 75,
      status: "failed",
      email: "jane.smith@example.com",
    },
    {
      id: "i9j0k1l2",
      amount: 300,
      status: "pending",
      email: "bob.wilson@example.com",
    },
    {
      id: "m3n4o5p6",
      amount: 50,
      status: "processing",
      email: "alice.brown@example.com",
    },
    {
      id: "q7r8s9t0",
      amount: 500,
      status: "success",
      email: "charlie.davis@example.com",
    },
    {
      id: "u1v2w3x4",
      amount: 180,
      status: "failed",
      email: "emma.jones@example.com",
    },
    {
      id: "y5z6a7b8",
      amount: 220,
      status: "pending",
      email: "frank.miller@example.com",
    },
    {
      id: "c9d0e1f2",
      amount: 95,
      status: "processing",
      email: "grace.lee@example.com",
    },
    {
      id: "g3h4i5j6",
      amount: 410,
      status: "success",
      email: "henry.taylor@example.com",
    },
    {
      id: "k7l8m9n0",
      amount: 60,
      status: "pending",
      email: "isabella.moore@example.com",
    },
  ];

  
  return (
    <div className="text-center">
      <h1>first example</h1>
      <div className="container mx-auto py-10">
        <DataTable<Payment> columns={columns} data={payments} />
      </div>
    </div>
  );
};

export default App;
