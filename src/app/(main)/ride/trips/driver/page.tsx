import { redirect } from 'next/navigation';

export default function TripsIndexPage() {
    redirect('/ride/trips/driver/my-trips');
}
