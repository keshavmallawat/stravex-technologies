import { getSiteSettings } from "@/lib/settings-data";
import { settingsToFormValues } from "@/lib/settings-types";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export const metadata = {
  title: "Settings | Stravex CMS",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsForm initialValues={settingsToFormValues(settings)} />;
}
