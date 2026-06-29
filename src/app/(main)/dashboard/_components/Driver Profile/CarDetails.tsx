"use client"
import type { CarDetailsType } from '@/types/Moderator'
import type { DriverDetailsType } from '@/types/Moderator'
import { DriverStatus } from '@/types/Moderator'
import { DetailItem } from '../DetailItem'
import { formatDateTime } from '@/lib/utils'
import { ZoomableImage } from './ZoomableImage'
import CarColorBadge from './CarColorBadge'

const CarDetails = ({ carDetails }: { carDetails: CarDetailsType }) => {
  return (
    <div className="pt-8 grid grid-cols-2 gap-x-8">
      {/*//* Details  */}
      <div className="p-6 rounded-3xl bg-background space-y-4 h-fit">
        <DetailItem label="Car Model" value={carDetails.model} />
        <DetailItem label="Color" value={<CarColorBadge colorName={carDetails.color} />} />
        <DetailItem label="Number Of Seats" value={carDetails.numOfSeats} />
        <DetailItem label="Plate" value={carDetails.plate} />
      </div>

      {/*//* Images */}
      <div className="p-6 rounded-3xl bg-background grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/*//? Car Image */}
        <div className='w-full col-span-2 flex flex-col'>
          <h4 className="font-semibold text-foreground mb-3">Car Preview</h4>
          <div className='relative w-full aspect-video bg-pale-sky rounded-md overflow-hidden border border-border'>
            <ZoomableImage
              imageSrc={carDetails.carPhoto}
              alt="driver license front"
            />
          </div>
        </div>

        {/*//? Car License Front */}
        <div className='w-full flex flex-col'>
          <h4 className="font-semibold text-foreground mb-3">Car License Front</h4>
          <div className='relative w-full aspect-video bg-pale-sky rounded-md overflow-hidden border border-border'>
            <ZoomableImage
              imageSrc={carDetails.carLicenseFront}
              alt="driver license front"
            />
          </div>
        </div>

        {/*//? Car License Back */}
        <div className='w-full flex flex-col'>
          <h4 className="font-semibold text-foreground mb-3">Car License Back</h4>
          <div className='relative w-full aspect-video bg-pale-sky rounded-md overflow-hidden border border-border'>
            <ZoomableImage
              imageSrc={carDetails.carLicenseFront}
              alt="driver license back"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails