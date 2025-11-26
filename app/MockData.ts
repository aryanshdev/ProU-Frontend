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
    id: 3,
    name: "CDE Person",
    role: "Tech Lead",
    department: "Development",
    status: EmpStatus.leave,
    salary: 2500000,
  },
  {
    id: 4,
    name: "FGH Person",
    role: "Social Media Lead",
    department: "PR",
    status: EmpStatus.present,
    salary: 500000,
  }, {
    id: 5,
    name: "XYZ Person",
    role: "Product Lead",
    department: "Product",
    status: EmpStatus.present,
    salary: 500000,
  },
];


export {MockData, EmpStatus};
export type {EmpData};