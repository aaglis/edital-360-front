import Logo from "@/components/Logo"

export default function Loading() {
  return (
    <div className="flex bg-white h-screen w-screen flex-col items-center justify-center gap-4">
        <Logo />
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}
