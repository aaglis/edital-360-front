import HeaderComponent from "../../components/HeaderComponent";

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
