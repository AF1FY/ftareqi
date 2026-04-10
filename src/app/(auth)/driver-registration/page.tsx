import DriverRegistrationForm from "./_components/driver-registration-form"

export const metadata = {
  title: "Driver Registration",
  description: "Complete your driver and vehicle registration",
}

export default function DriverRegistrationPage() {
  return (
    <div className="full-scn flex items-center justify-center transition-colors">
      <div className="w-full max-w-4xl">
        <DriverRegistrationForm />
      </div>
    </div>
  )
}
