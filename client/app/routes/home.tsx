import type { Route } from "./+types/Home";
import Test from "~/components/Test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Test />;
}
