"use client";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const getUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.token}`,
      },
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Dashboard</h1>
            <button
        onClick= {getUser}
        className="btn btn-primary"
      >
        Get Users
      </button>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </div>
  );
};
export default Dashboard;