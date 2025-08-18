import HeaderComponent from "@/app/components/HeaderComponent";
import FooterComponent from "@/app/components/FooterComponent";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
        <HeaderComponent />
        {children}
        <FooterComponent />
    </div>
  );
}
