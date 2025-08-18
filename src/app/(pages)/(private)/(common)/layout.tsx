import HeaderComponent from "@/components/HeaderComponent";


export default function CommonPrivateLayout({
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
