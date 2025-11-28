enum EmpStatus {
  present = "Present",
  leave = "On Leave",
}
interface EmpData {
  id: number;
  name: string;
  role: string;
  department: string;
  status: EmpStatus;
  salary: number;
}

const MockData: EmpData[] = [
  {
    id: 1,
    name: "Aryansh Gupta",
    role: "Full Stack Dev",
    department: "Development",
    status: EmpStatus.present,
    salary: 1000000,
  },
  {
    id: 2,
    name: "ABC Person",
    role: "Product Manager",
    department: "Product",
    status: EmpStatus.present,
    salary: 500000,
  },
  {
    id: 19,
    name: "CDE Person",
    role: "Tech Lead",
    department: "Development",
    status: EmpStatus.leave,
    salary: 2500000,
  },
  {
    id: 11,
    name: "FGH Person",
    role: "Social Media Lead",
    department: "PR",
    status: EmpStatus.present,
    salary: 500000,
  },
  {
    id: 5,
    name: "XYZ Person",
    role: "Product Lead",
    department: "Product",
    status: EmpStatus.present,
    salary: 500000,
  },
  {
    id: 3,
    name: "Person CDE",
    role: "Tech Lead",
    department: "Development",
    status: EmpStatus.leave,
    salary: 2500000,
  },
  {
    id: 4,
    name: "Person DEF",
    role: "Social Media Lead",
    department: "PR",
    status: EmpStatus.present,
    salary: 500000,
  },
  {
    id: 12,
    name: "Person EFG",
    role: "Product Lead",
    department: "Product",
    status: EmpStatus.present,
    salary: 2000000,
  },
  
  {
    id: 7,
    name: "GHI",
    role: "Product Engineer",
    department: "Development",
    status: EmpStatus.present,
    salary: 800000,
  },
  {
    id: 8,
    name: "EFG",
    role: "HR Manager",
    department: "HR",
    status: EmpStatus.leave,
    salary: 950000,
  },
  {
    id: 9,
    name: "IJK Person",
    role: "Intern",
    department: "Development",
    status: EmpStatus.present,
    salary: 300000,
  },
];

export { MockData, EmpStatus };
export type { EmpData };
