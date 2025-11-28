"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Database,
  FileJson,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  Loader2,
  Check,
  X,
} from "lucide-react";

import { MockData, EmpStatus } from "../MockData";
import { EmpData } from "../MockData";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function DashboardPage() {
  const [dataSource, setDataSource] = useState("mock");
  const [searchedName, setSearchedName] = useState("");
  const [EmpData, setEmpData] = useState<EmpData[] | null>(MockData);
  const AddEmpRef = useRef<HTMLDivElement>(null);

  const UpdateEmployeeDetails = useCallback(async (updatedEmp: EmpData) => {
    try {
      const res = await fetch("http://localhost:10000/app/updateDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          auth: localStorage.getItem("authToken") || "",
        },
        body: JSON.stringify({
          id: updatedEmp.id,
          name: updatedEmp.name,
          role: updatedEmp.role,
          dept: updatedEmp.department, 
          status: updatedEmp.status,
          salary: updatedEmp.salary,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEmpData((prev) =>
        prev
          ? prev.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
          : null
      );
      toast.success("Details Updated Successfully");
    } catch (err) {
      toast.error("Failed To Update");
    }
  }, []);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      const newUrl = "/dashboard";
      router.replace(newUrl);
    }
  }, [searchParams, router]);
  const setMode = (mode: string) => {
    if (mode == "real") {
      setDataSource("real");
      fetch("http://localhost:10000/app/allEmp", {
        headers: { auth: localStorage.getItem("authToken") || "" },
      })
        .then((res) => {
          if (res.status == 403){
            toast.error("Session TimedOut, Please Relogin")
            router.push("/");
            throw "Session Up"
          }
          return res.json()
        })
        .then((res) => setEmpData(res));
    } else {
      setDataSource("mock");
      setEmpData(MockData);
    }
  };
  const DeleteEmployee = useCallback(async (id: number) => {
    try {
      const res = await fetch("http://localhost:10000/app/rmEmp", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          auth: localStorage.getItem("authToken") || "",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed");

      setEmpData((prev) => (prev ? prev.filter((emp) => emp.id !== id) : null));
      toast.success("Employee Deleted");
    } catch (err) {
      console.log(err)
      toast.error("Failed to Delete");
    }
  }, []);
  const MarkEmployeePresentAbsent = useCallback(
    async (id: number, status: EmpStatus) => {
      try {
        const res = await fetch(
          "http://localhost:10000/app/markPresentAbsent",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              auth: localStorage.getItem("authToken") || "",
            },
            body: JSON.stringify({
              id,
              status: status == EmpStatus.present ? "On Leave" : "Present",
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to update");

        setEmpData((prev) =>
          prev
            ? prev.map((emp) =>
                emp.id === id
                  ? {
                      ...emp,
                      status:
                        status == EmpStatus.present
                          ? EmpStatus.leave
                          : EmpStatus.present,
                    }
                  : emp
              )
            : null
        );

        toast.success("Employee Attendance Updated!");
      } catch (err) {
        console.error(err);
        toast.error("Failed To Update");
      }
    },
    []
  );

  const AddNewEmployeeToList = useCallback((emp: EmpData) => {
    setEmpData((old) => (old ? [...old, emp] : [emp]));
  }, []);
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
        <StatCard title="Total Employees" value={EmpData!.length.toString()} />
        <StatCard
          title="Present Today"
          value={EmpData!
            .filter((ele) => ele.status == EmpStatus.present)
            .length.toString()}
        />
        <StatCard
          title="Present %"
          value={
            ( EmpData!.length > 0 ?
              (EmpData!.filter((ele) => ele.status == EmpStatus.present)
                .length /
                EmpData!.length) *
              100 : 0
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
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={() => {
                AddEmpRef.current.toggle();
              }}
            >
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
              {dataSource !== "mock" ? (
                <NewEmpEntry onSuccess={AddNewEmployeeToList} ref={AddEmpRef} />
              ) : (
                <></>
              )}
              {EmpData!
                .filter((emp) => emp.name.toLowerCase().includes(searchedName))
                .map((emp) => (
                  <EmpDisplay
                    key={emp.id}
                    emp={emp}
                    isMock={dataSource == "mock"}
                    MarkEmpCallback={MarkEmployeePresentAbsent}
                    DeleteEmpCallback = {DeleteEmployee}
                    UpdateEmpCallback={UpdateEmployeeDetails}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const NewEmpEntry = forwardRef(
  ({ onSuccess }: { onSuccess: (newEmp: EmpData) => void }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      role: "",
      department: "",
      status: EmpStatus.present,
      salary: "",
    });

    useImperativeHandle(ref, () => ({
      toggle: () => setIsVisible((prev) => !prev),
      show: () => setIsVisible(true),
      hide: () => setIsVisible(false),
    }));

    const handleChange = (e: any) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
      if (!formData.name || !formData.role || !formData.salary) {
        toast.error("Please fill all fields");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:10000/app/createEmp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          auth: localStorage.getItem("authToken") || ""
          },
          body: JSON.stringify({
            ...formData,
            salary: Number(formData.salary),
          }),
        });

        if (!res.ok) throw new Error("Failed");

        const newEmployeeID = await res.json();
        toast.success("Employee Added!");
        onSuccess({
          id: newEmployeeID as number,
          name: formData.name,
          department: formData.department,
          role: formData.role,
          salary: Number.parseFloat(formData.salary),
          status: formData.status,
        });
        setFormData({
          name: "",
          role: "",
          department: "",
          status: EmpStatus.present,
          salary: "",
        });
        setIsVisible(false);
      } catch (err) {
        toast.error("Failed to add employee");
      } finally {
        setLoading(false);
      }
    };

    if (!isVisible) return null;

    return (
      <tr className="bg-zinc-900 border-zinc-700 transition-colors animate-in fade-in slide-in-from-top-2">
        <td className="px-6 py-4">
          <input
            autoFocus
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            name="department"
            placeholder="Dept"
            value={formData.department}
            onChange={handleChange}
            className="w-24 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value={EmpStatus.present}>Present</option>
            <option value={EmpStatus.leave}>On Leave</option>
          </select>
        </td>
        <td className="px-6 py-4 text-right">
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-24 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm text-right focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              disabled={loading}
              className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);
NewEmpEntry.displayName = "NewEmpEntry";

function EmpDisplay({
  emp,
  isMock,
  MarkEmpCallback,
  DeleteEmpCallback,
  UpdateEmpCallback,
}: {
  emp: EmpData;
  isMock: boolean;
  MarkEmpCallback: (id: number, status: EmpStatus) => Promise<void>;
  DeleteEmpCallback: (id: number) => Promise<void>;
  UpdateEmpCallback: (updatedEmp: EmpData) => Promise<void>;
}) {
  const menuRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for the inputs
  const [editData, setEditData] = useState<EmpData>(emp);

  const handleEditChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    // Call the parent update function
    await UpdateEmpCallback(editData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditData(emp); // Reset data
    setIsEditing(false);
  };

  // --- RENDER EDIT MODE ---
  if (isEditing) {
    return (
      <tr className="bg-blue-500/5 border-b border-blue-500/20">
        <td className="px-6 py-4">
          <input
            name="name"
            value={editData.name}
            onChange={handleEditChange}
            className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <input
            name="role"
            value={editData.role}
            onChange={handleEditChange}
            className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <input
            name="department"
            value={editData.department}
            onChange={handleEditChange}
            className="w-24 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <select
            name="status"
            value={editData.status}
            onChange={handleEditChange}
            className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value={EmpStatus.present}>Present</option>
            <option value={EmpStatus.leave}>On Leave</option>
          </select>
        </td>
        <td className="px-6 py-4 text-right">
          <input
            name="salary"
            type="number"
            value={editData.salary}
            onChange={handleEditChange}
            className="w-24 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-zinc-300 text-sm text-right focus:outline-none focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={saveEdit}
              className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // --- RENDER NORMAL DISPLAY MODE ---
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
            className="absolute bg-black !hidden rounded-lg z-10 top-1/2 -translate-y-1/2 right-10 w-max flex flex-col gap-2 shadow-xl border border-white/10"
          >
            {!isMock ? (
              <>
                <div className="hover:bg-zinc-950 bg-black transition-all duration-200 w-full px-5 py-2 rounded-lg text-base text-zinc-400 whitespace-nowrap" onClick={() => {
                    setIsEditing(true);
                    menuRef.current.classList.add("!hidden"); // Hide menu
                  }}
                >
                  Update Details
                </div>
                <div
                  className="hover:bg-zinc-900 cursor-pointer transition-all duration-200 w-full px-5 py-2 text-base text-left whitespace-nowrap"
                  onClick={() => {
                    MarkEmpCallback(emp.id, emp.status);
                    menuRef.current.classList.add("!hidden");
                  }}
                >
                  {emp.status == "Present" ? "Mark Absent" : "Mark Present"}
                </div>
                <div
                  className="hover:bg-red-800 cursor-pointer transition-all duration-200 w-full px-5 py-2 rounded-b-lg text-base  text-left whitespace-nowrap"
                  onClick={() => {
                    DeleteEmpCallback(emp.id);
                  }}
                >
                  Delete Employee
                </div>
              </>
            ) : (
              <div className="hover:bg-zinc-950 bg-black transition-all duration-200 w-full px-5 py-2 rounded-lg text-base text-zinc-400 whitespace-nowrap">
                More Options Only Available In Real Data
              </div>
            )}
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
