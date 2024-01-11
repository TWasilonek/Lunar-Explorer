import { paths } from "@/paths";
import { redirect } from "next/navigation";

export default function MePage() {
  redirect(paths.profile());
}
