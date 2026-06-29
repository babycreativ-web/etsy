"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface MarketChartsProps {
  revenueHistory: any[];
  shops: any[];
}

export default function MarketCharts({ revenueHistory, shops }: MarketChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Monthly Revenue Trends Chart */}
      <div className="bg-[#141622] border border-[#1f2235] p-6 rounded-2xl lg:col-span-2">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          Estimated Monthly Revenue Growth (Top Shops)
        </h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVintage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBoho" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#24283b" />
              <XAxis dataKey="month" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1c1e2d", borderColor: "#334155", color: "#f8fafc" }} 
                labelStyle={{ fontWeight: "bold" }}
              />
              <Area name="VintageCrafts ($)" type="monotone" dataKey="VintageCrafts" stroke="#f97316" fillOpacity={1} fill="url(#colorVintage)" />
              <Area name="BohoJewelry ($)" type="monotone" dataKey="BohoJewelryStudio" stroke="#6366f1" fillOpacity={1} fill="url(#colorBoho)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Share Pie Chart */}
      <div className="bg-[#141622] border border-[#1f2235] p-6 rounded-2xl">
        <h4 className="text-sm font-bold text-slate-200 mb-4">Market Share Distribution</h4>
        <div className="h-[230px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={shops}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="estimatedRevenue"
                nameKey="name"
              >
                <Cell fill="#f97316" />
                <Cell fill="#10b981" />
                <Cell fill="#6366f1" />
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-2">
          {shops.slice(0, 3).map((shop, idx) => {
            const colors = ["#f97316", "#10b981", "#6366f1"];
            return (
              <div key={shop.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % 3] }}></span>
                  <span>{shop.name}</span>
                </div>
                <span className="font-semibold text-slate-200">${shop.estimatedRevenue.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
