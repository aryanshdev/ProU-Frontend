"use client";

import { MockData, EmpStatus } from "../../MockData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const getSalaryByDept = () => {
  const data: Record<string, number> = {};

  MockData.forEach((emp) => {
    if (data[emp.department]) {
      data[emp.department] += emp.salary;
    } else {
      data[emp.department] = emp.salary;
    }
  });

  return Object.keys(data).map((dept) => ({
    name: dept,
    value: data[dept],
  }));
};

const getStatusByDept = () => {
  const data: Record<string, { Present: number; Leave: number }> = {};

  MockData.forEach((emp) => {
    if (!data[emp.department]) {
      data[emp.department] = { Present: 0, Leave: 0 };
    }

    if (emp.status === EmpStatus.present) {
      data[emp.department].Present += 1;
    } else {
      data[emp.department].Leave += 1;
    }
  });
  return Object.keys(data).map((dept) => ({
    name: dept,
    Present: data[dept].Present,
    Leave: data[dept].Leave,
  }));
};

const getEmployeeByDept = ()=>{
    const data: Record<string, number> = {};
  MockData.forEach((emp) => {
    if (!data[emp.department]) {
      data[emp.department] = 1;
    }
    else{
       data[emp.department] += 1;
    }
  });
    return Object.keys(data).map((dept) => ({
    name: dept,
    value: data[dept],
  }));
}

// Colors copied fomr TailwindCSS website
const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

export default function StatsPage() {
  const salaryData = getSalaryByDept();
  const employeeData = getEmployeeByDept()
  const statusData = getStatusByDept();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Analysis</h1>
          <p className="text-zinc-400 mt-1">
            Demo Visualization Based On{" "}
            <span className="font-bold text-white">Mock Data</span>.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Pie */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-6">
            Salary Distribution by Dept
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salaryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(0,0,0,0)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#e4e4e7" }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Number Pie */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-6">
            Total Employees Distribution by Dept
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {employeeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(0,0,0,0)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#e4e4e7" }}
                  formatter={(value: number) => `${value.toLocaleString()} People`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Attendance */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm col-span-2">
          <h2 className="text-lg font-semibold text-white mb-6">
            Department Attendance
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#27272a", opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#e4e4e7" }}
                />
                <Legend />
                {/* Stacked Bars */}
                <Bar
                  dataKey="Present"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 0, 4, 4]}
                  barSize={40}
                />
                <Bar
                  dataKey="Leave"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
