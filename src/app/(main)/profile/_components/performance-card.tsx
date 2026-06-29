import type { DriverDetails } from "@/types/Driver";

export default function PerformanceCard({
    isDark,
    driver,
    isLoading,
}: {
    isDark: boolean;
    driver: DriverDetails | null | undefined;
    isLoading: boolean;
}) {
    if (isLoading) {
        return (
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-900/30">
                <div className="h-4 w-24 animate-pulse rounded bg-white/30" />
                <div className="mt-6 h-8 w-32 animate-pulse rounded bg-white/20" />
            </div>
        );
    }

    return (
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-900/30 relative overflow-hidden group border border-blue-500">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-colors duration-500"></div>

            <div className="relative z-10">
                <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-6">
                    Performance
                </h3>

                <div className="space-y-6">
                    <div>
                        <p className="text-3xl font-bold">
                            {driver?.tripsOfferedCount ?? 0}
                        </p>
                        <p className="text-sm text-blue-200 font-medium">
                            Total Trips Offered
                        </p>
                    </div>

                    <div className="w-full h-px bg-white/20"></div>

                    <div>
                        <p className="text-3xl font-bold">
                            {driver?.rating
                                ? `${driver.rating.toFixed(1)} / 5`
                                : "N/A"}
                        </p>
                        <p className="text-sm text-blue-200 font-medium">
                            Current Rating
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
