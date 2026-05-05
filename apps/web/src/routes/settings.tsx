import { createFileRoute, redirect } from "@tanstack/react-router";
import SettingsPage from "../components/SettingsPage";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  component: SettingsPage,
});
