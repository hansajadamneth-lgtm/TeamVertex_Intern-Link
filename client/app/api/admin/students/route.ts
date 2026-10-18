import { NextResponse } from "next/server";

const initialStudents = [
  { id: "STU-1024", fullName: "Sarah Williams", email: "sarah.williams@email.com", education: "Computer Science", status: "Active" },
  { id: "STU-1025", fullName: "Michael Perera", email: "michael.perera@email.com", education: "Information Technology", status: "Active" },
  { id: "STU-1026", fullName: "Ayesha Fernando", email: "ayesha.fernando@email.com", education: "Software Engineering", status: "Inactive" },
  { id: "STU-1027", fullName: "Daniel Silva", email: "daniel.silva@email.com", education: "Data Science", status: "Active" },
  { id: "STU-1028", fullName: "Nethmi Jayasinghe", email: "nethmi.j@email.com", education: "Information Systems", status: "Pending" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let filtered = [...initialStudents];
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.fullName.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        s.education.toLowerCase().includes(term)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}
