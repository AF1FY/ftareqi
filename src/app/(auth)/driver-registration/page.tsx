import DriverRegistrationForm from "./_components/driver-registration-form"

export const metadata = {
  title: "Driver Registration",
  description: "Complete your driver and vehicle registration",
}

export default function DriverRegistrationPage() {
  return (
    <main className="min-h-screen pt-[100px] flex items-center justify-center bg-[#fbfcff] dark:bg-[#0E131B] transition-colors">
      <div className="w-full max-w-2xl">
        <DriverRegistrationForm />
      </div>
    </main>
  )
}
