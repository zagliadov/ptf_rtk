
export interface IDetails {
  reportName: string;
  content: string;
  creator: string;
  department: string;
  role: string;
  dateCreated: string;
  dateUpdated: string;
  purpose: string;
}
export interface IReports {
  id: number;
  name: string;
  details: IDetails[];
}
export const emptyReport = [];
export const reports: IReports[] = [
  {
    id: 0,
    name: "Site reports",
    details: [
      {
        reportName: "Site Report A",
        content: "Site Report Content A",
        creator: "Alice Smith",
        department: "Development",
        role: "Developer",
        dateCreated: "30.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Site Analysis",
      },
    ],
  },
  {
    id: 1,
    name: "Travel reports Content Based on 12",
    details: [
      {
        reportName: "Travel Report B Content Base on 19",
        content: "Travel Report Content B",
        creator: "Eva Brown",
        department: "Development",
        role: "Developer",
        dateCreated: "01.11.2023",
        dateUpdated: "02.11.2023",
        purpose: "Travel Expense Tracking",
      },
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Eva Brown",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Eva Brown",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "Eva Brown",
        department: "Development",
        role: "Developer",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
    ],
  },
  {
    id: 2,
    name: "Budget reports",
    details: [
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "Ivy Wilson",
        department: "Development",
        role: "Developer",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Ivy Wilson",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Ivy Wilson",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "Ivy Wilson",
        department: "Development",
        role: "Developer",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
    ],
  },
  {
    id: 3,
    name: "Marketing reports",
    details: [
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Frank Harris",
        department: "Design",
        role: "Designer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 4,
    name: "Marketing reports",
    details: [
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Frank Harris",
        department: "Design",
        role: "Designer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 5,
    name: "Site reports",
    details: [
      {
        reportName: "Site Report A",
        content: "Site Report Content A",
        creator: "Henry Lewis",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "30.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Site Analysis",
      },
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Henry Lewis",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Henry Lewis",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "Henry Lewis",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
    ],
  },
  {
    id: 6,
    name: "Travel reports",
    details: [
      {
        reportName: "Travel Report B",
        content: "Travel Report Content B",
        creator: "David Green",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "01.11.2023",
        dateUpdated: "02.11.2023",
        purpose: "Travel Expense Tracking",
      },
    ],
  },
  {
    id: 7,
    name: "Budget reports",
    details: [
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "David Green",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
    ],
  },
  {
    id: 8,
    name: "Marketing reports",
    details: [
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Henry Lewis",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 9,
    name: "Marketing reports",
    details: [
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Bob Johnson",
        department: "Design",
        role: "Designer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 10,
    name: "Site reports",
    details: [
      {
        reportName: "Site Report A",
        content: "Site Report Content A",
        creator: "Jack Young",
        department: "Design",
        role: "Designer",
        dateCreated: "30.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Site Analysis",
      },
    ],
  },
  {
    id: 11,
    name: "Travel reports",
    details: [
      {
        reportName: "Travel Report B",
        content: "Travel Report Content B",
        creator: "Grace Clark",
        department: "Management",
        role: "Manager",
        dateCreated: "01.11.2023",
        dateUpdated: "02.11.2023",
        purpose: "Travel Expense Tracking",
      },
    ],
  },
  {
    id: 12,
    name: "Budget reports",
    details: [
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "Frank Harris",
        department: "Design",
        role: "Designer",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
    ],
  },
  {
    id: 13,
    name: "Marketing reports",
    details: [
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Eva Brown",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 14,
    name: "Marketing reports",
    details: [
      {
        reportName: "Marketing Report D",
        content: "Marketing Report Content D",
        creator: "Carol White",
        department: "Management",
        role: "Manager",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Management Report H",
        content: "Management Report Content H",
        creator: "Carol White",
        department: "Management",
        role: "Manager",
        dateCreated: "09.11.2023",
        dateUpdated: "18.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 15,
    name: "Analyst reports",
    details: [
      {
        reportName: "Analyst Report A",
        content: "Analyst Report Content A",
        creator: "David Green",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "30.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Site Analysis",
      },
      {
        reportName: "Analyst Report V",
        content: "Analyst Report Content V",
        creator: "David Green",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "12.10.2023",
        dateUpdated: "14.10.2023",
        purpose: "Site Analysis",
      },
      {
        reportName: "Analyst Report C",
        content: "Analyst Report Content C",
        creator: "David Green",
        department: "Analyst",
        role: "Analyst",
        dateCreated: "30.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Site Analysis",
      },
    ],
  },
  {
    id: 16,
    name: "Travel reports",
    details: [
      {
        reportName: "Travel Report B",
        content: "Travel Report Content B",
        creator: "Carol White",
        department: "Management",
        role: "Manager",
        dateCreated: "01.11.2023",
        dateUpdated: "02.11.2023",
        purpose: "Travel Expense Tracking",
      },
      {
        reportName: "Travel Report C",
        content: "Travel Report Content C",
        creator: "Carol White",
        department: "Management",
        role: "Manager",
        dateCreated: "06.11.2023",
        dateUpdated: "09.11.2023",
        purpose: "Travel Expense Tracking",
      },
      {
        reportName: "Travel Report E",
        content: "Travel Report Content E",
        creator: "Carol White",
        department: "Management",
        role: "Manager",
        dateCreated: "09.11.2023",
        dateUpdated: "012.11.2023",
        purpose: "Travel Expense Tracking",
      },
    ],
  },
  {
    id: 17,
    name: "Budget reports",
    details: [
      {
        reportName: "Budget Report C",
        content: "Budget Report Content C",
        creator: "Carol White",
        department: "Management",
        role: "Manager",
        dateCreated: "03.11.2023",
        dateUpdated: "04.11.2023",
        purpose: "Annual Budget Planning",
      },
    ],
  },
  {
    id: 18,
    name: "Development reports",
    details: [
      {
        reportName: "Development Report D",
        content: "Marketing Report Content D",
        creator: "Alice Smith",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
      {
        reportName: "Development Report V",
        content: "Marketing Report Content V",
        creator: "Alice Smith",
        department: "Development",
        role: "Developer",
        dateCreated: "07.11.2023",
        dateUpdated: "08.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 19,
    name: "Development reports",
    details: [
      {
        reportName: "Development Report D",
        content: "Development Report Content D",
        creator: "Alice Smith",
        department: "Development",
        role: "Developer",
        dateCreated: "05.11.2023",
        dateUpdated: "06.11.2023",
        purpose: "Market Analysis",
      },
    ],
  },
  {
    id: 20,
    name: "Final reports",
    details: [
      {
        reportName: "Final Report T",
        content: "Final Report Content T",
        creator: "Bob Johnson",
        department: "Design",
        role: "Designer",
        dateCreated: "30.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Project Closure",
      },
      {
        reportName: "Final Report C",
        content: "Final Report Content C",
        creator: "Bob Johnson",
        department: "Design",
        role: "Designer",
        dateCreated: "03.10.2023",
        dateUpdated: "31.10.2023",
        purpose: "Project Closure",
      },
      {
        reportName: "Final Report U",
        content: "Final Report Content U",
        creator: "Bob Johnson",
        department: "Design",
        role: "Designer",
        dateCreated: "25.10.2023",
        dateUpdated: "28.10.2023",
        purpose: "Project Closure",
      },
    ],
  },
];

export const mockResources = [
  { id: 1, role: 'Developer', fullName: 'Alice Smith', email: 'alice@example.com', teamLeadId: null, province: 'Ontario', logo: 'logo1.png' },
  { id: 2, role: 'Designer', fullName: 'Bob Johnson', email: 'bob@example.com', teamLeadId: 1, province: 'Quebec', logo: 'logo2.png' },
  { id: 3, role: 'Manager', fullName: 'Carol White', email: 'carol@example.com', teamLeadId: 2, province: 'British Columbia', logo: 'logo3.png' },
  { id: 4, role: 'Analyst', fullName: 'David Green', email: 'david@example.com', teamLeadId: 1, province: 'Alberta', logo: 'logo4.png' },
  { id: 5, role: 'Developer', fullName: 'Eva Brown', email: 'eva@example.com', teamLeadId: 3, province: 'Manitoba', logo: 'logo5.png' },
  { id: 6, role: 'Designer', fullName: 'Frank Harris', email: 'frank@example.com', teamLeadId: 2, province: 'Saskatchewan', logo: 'logo6.png' },
  { id: 7, role: 'Manager', fullName: 'Grace Clark', email: 'grace@example.com', teamLeadId: 4, province: 'Nova Scotia', logo: 'logo7.png' },
  { id: 8, role: 'Analyst', fullName: 'Henry Lewis', email: 'henry@example.com', teamLeadId: 5, province: 'Newfoundland and Labrador', logo: 'logo8.png' },
  { id: 9, role: 'Developer', fullName: 'Ivy Wilson', email: 'ivy@example.com', teamLeadId: 6, province: 'New Brunswick', logo: 'logo9.png' },
  { id: 10, role: 'Designer', fullName: 'Jack Young', email: 'jack@example.com', teamLeadId: 7, province: 'Prince Edward Island', logo: 'logo10.png' }
];
