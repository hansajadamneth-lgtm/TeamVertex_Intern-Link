import { redirect } from "next/navigation";

/** The company-management tool is an admin-only workflow. */
export default function ManageCompaniesShortcut() {
  redirect("/admin/companies");
}
