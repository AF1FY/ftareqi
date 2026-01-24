'use client'
import type { DriverDetailsType } from '@/types/Moderator'
import { DriverStatus, StatusStyles } from '@/types/Moderator'
import { DetailItem } from '../DetailItem'
import { formatDateTime } from '@/lib/utils'
import { ZoomableImage } from './ZoomableImage'

const DriverDetails = ({ driverDetails }: { driverDetails: DriverDetailsType }) => {
    const currentStyle = StatusStyles[driverDetails.driverStatus] || 'bg-gray-100 text-gray-600'
    const { driverStatus } = driverDetails

    return (
        <div className="pt-8 grid grid-cols-2 gap-x-8">
            {/*//* Details  */}
            <div className="p-6 rounded-3xl bg-background space-y-4">
                <DetailItem label="Full Name" value={driverDetails.fullName} />
                <DetailItem label="Phone Number" value={driverDetails.phoneNumber} />
                <div className="flex flex-col gap-y-1">
                    <h3 className="font-semibold text-foreground">Driver Status</h3>
                    <p className={`${currentStyle} w-fit rounded-full capitalize py-0.5 px-3 font-medium`}>
                        {driverStatus}
                    </p>
                </div>
                <DetailItem label="License Expiry Date" value={formatDateTime(driverDetails.driverLicenseExpiryDate)} />
                <DetailItem label="Profile Creation Date" value={formatDateTime(driverDetails.profileCreationDate)} />
            </div>
            {/*//* Images */}
            <div className="h-fit p-6 rounded-3xl bg-background grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Image 1 */}
                <div className='w-full flex flex-col'>
                    <h4 className="font-semibold text-foreground mb-3">Driver License Front</h4>
                    <div className='relative w-full aspect-video bg-pale-sky rounded-md overflow-hidden border border-border'>
                        <ZoomableImage
                            src={driverDetails.driverLicenseFront}
                            alt="driver license front"
                        />
                    </div>
                </div>

                {/* Image 2 */}
                <div className='w-full flex flex-col'>
                    <h4 className="font-semibold text-foreground mb-3">Driver License Back</h4>
                    <div className='relative w-full aspect-video bg-pale-sky rounded-md overflow-hidden border border-border'>
                        <ZoomableImage
                            src={driverDetails.driverLicenseBack}
                            alt="driver license back"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverDetails
