import HeaderComponent from "@/app/components/HeaderComponent";


export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <HeaderComponent />
        {children}
       
    </div>
  );
}
