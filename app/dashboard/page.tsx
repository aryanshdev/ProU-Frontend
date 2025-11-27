"use client";

import { useRef, useState } from "react";
import {
  Database,
  FileJson,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { MockData, EmpStatus } from "../MockData";
import { EmpData } from "../MockData";

export default function DashboardPage() {
  const [dataSource, setDataSource] = useState("mock");
  const [searchedName, setSearchedName] = useState("");
  const [EmpData, setEmpData] = useState<EmpData[] | null>(MockData);
  // const [serverData, setServerData] = useState<EmpData[] | null>(null);

  const setMode = (mode: string) => {
    if (mode == "real") {
      setDataSource("real");
      fetch("http://localhost:10000/app/allEmp")
        .then((res) => res.json())
        .then((res) => setEmpData(res));
    } else {
      setDataSource("mock");
      setEmpData(MockData);
    }
  };
  const FilterUsers = (name: string) => {
    setSearchedName(name.toLowerCase());
  };
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">
            Manage your team easily and efficiently.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="bg-zinc-900 p-1 rounded-lg border border-white/10 flex items-center">
          <button
            onClick={() => setMode("mock")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              dataSource === "mock"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileJson className="h-4 w-4" />
            Mock Data (Frontend)
          </button>
          <button
            onClick={() => setMode("real")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              dataSource === "real"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Database className="h-4 w-4" />
            Real Data (Backend)
          </button>
        </div>
      </div>

      {/* STats Display*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Employees" value={EmpData!.length} />
        <StatCard
          title="Present Today"
          value={
            EmpData!.filter((ele) => ele.status == EmpStatus.present).length
          }
        />
        <StatCard
          title="Present %"
          value={
            (
              (EmpData!.filter((ele) => ele.status == EmpStatus.present)
                .length /
                EmpData!.length) *
              100
            )
              .toFixed(1)
              .toString() + "%"
          }
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50"
              onInput={(ele) => {
                FilterUsers(ele.target.value);
              }}
            />
          </div>

          {/* Only show "Add" button if we are in real Mode (since we can't edit JSON file) */}
          {dataSource === "real" && (
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
          )}
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-200 font-medium">
              <tr>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Salary</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            <NewEmpEntry />
              {EmpData!
                .filter((emp) => emp.name.toLowerCase().includes(searchedName))
                .map((emp) => (
                  <EmpDisplay key={emp.id} emp={emp} />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NewEmpEntry(){

}

function EmpDisplay({ emp }: { emp: EmpData }) {
  const menuRef = useRef(null);
  const AttandanceChange = ()=>{

  }
  return (
    <tr key={emp.id} className="hover:bg-white/5 transition-colors">
      <td className="px-6 py-4 text-white font-medium">{emp.name}</td>
      <td className="px-6 py-4">{emp.role}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-white/10">
          {emp.department}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">

          {emp.status === EmpStatus.present ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Clock className="h-4 w-4 text-amber-500" />
          )}
          <span
            className={
              emp.status === EmpStatus.present
                ? "text-emerald-400"
                : "text-amber-400"
            }
          >
            {emp.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-gray-300">₹{emp.salary}</td>
      <td className="px-6 py-4 text-right">
        <button
          title="More"
          onClick={() => {
            menuRef.current.classList.toggle("!hidden");
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
        >
          <div
            ref={menuRef}
            className="absolute bg-black !hidden rounded-lg z-10 top-1/2 -translate-y-1/2 right-10 w-max flex flex-col gap-2"
          >
            <div className=" hover:bg-zinc-950 transition-all duration-200 w-full px-5 py-2 rounded-t-lg text-base">
              Update Details
            </div>
            <div className="hover:bg-zinc-950 transition-all duration-200 w-full px-5 py-2   text-base">
              {emp.status == "Present" ? "Mark Absent" : "Mark Present"}{" "}
            </div>
            <div className="hover:bg-zinc-950 transition-all duration-200 w-full px-5 py-2 rounded-b-lg  text-base">
              Delete Employee
            </div>
          </div>
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm hover:border-white/10 transition-colors">
      <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
    </div>
  );
}
