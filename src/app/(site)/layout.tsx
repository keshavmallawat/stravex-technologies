import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/settings-data";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <Nav navLinks={settings.navLinks} logoLightUrl={settings.logoLightUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
