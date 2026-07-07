import { getStoreConfig } from "@/lib/config";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const config = await getStoreConfig();
  const demoEnabled = config.modules?.demo_account?.active ?? false;

  return <LoginForm demoEnabled={demoEnabled} />;
}
