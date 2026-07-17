import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axiosInstance from "../../services/axios";
import Loader from "../common/Loader";

/**
 * SalesChart – renders a responsive line chart of sales over time.
 * Expected API response format: [{ month: "Jan", sales: 1234 }, ...]
 */
export default function SalesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/sales-stats");
        setData(res.data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-12 h-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="h-64 w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="month" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
