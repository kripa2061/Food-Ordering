import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  Users2Icon,
  Loader
} from "lucide-react";
import { toast } from "react-hot-toast";
import "./Dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = "https://food-ordering-backend-jygm.onrender.com";

  // Fetch dashboard stats (orders, revenue, users)
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/dashboard`,{withCredentials:true});
      if (response.data.success) {
        const data = response.data.data;
        setDashboardData({
          totalOrders: data.totalOrders,
          totalRevenue: data.totalRevenue,
          totalUsers: data.totalUsers
        });
      } else {
        toast.error("Failed to fetch dashboard stats");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoods(response.data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardStats(), fetchFoods()]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Only active foods
  const activeFoods = foods.filter(f => f.isActive);

  const stats = [
    { title: "Total Orders", value: dashboardData.totalOrders, icon: ChartLineIcon },
    { title: "Total Revenue", value: `Rs. ${dashboardData.totalRevenue}`, icon: CircleDollarSignIcon },
    { title: "Active Food", value: activeFoods.length, icon: PlayCircleIcon },
    { title: "Total Users", value: dashboardData.totalUsers, icon: Users2Icon }
  ];

  return (
    <>
      {loading ? (
        <div className="adm-loader">
          <Loader className="spin" />
        </div>
      ) : (
        <div className="adm-dashboard">
          <h2 className="adm-dashboard-title">Admin Dashboard</h2>

          <div className="adm-stats-container">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="adm-stat-box">
                  <div className="adm-stat-text">
                    <p className="adm-stat-value">{stat.value}</p>
                    <p className="adm-stat-title">{stat.title}</p>
                  </div>
                  <StatIcon className="adm-stat-icon" />
                </div>
              );
            })}
          </div>

          <p className="adm-section-title">Active Food</p>
          <div className="adm-active-shows">
            {activeFoods.length === 0 ? (
              <p>No active food</p>
            ) : (
              activeFoods.map(item => (
                <div key={item._id} className="adm-show-box">
                  <img
                    src={`${url}/Uploads/${item.image}`}
                    alt={item.name}
                    className="adm-show-image"
                  />
                  <p className="adm-show-title">{item.name}</p>
                  <div className="adm-show-price-rating">
                    <p className="adm-show-price">Rs. {item.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
