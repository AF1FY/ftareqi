import { getUserDetailsAsync } from '@/lib/actions/Admin.actions';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProfileImageWithLightbox } from '../../_components/Driver Profile/ProfileImageWithLightbox';
import { IUserDetails, Role } from '@/types/User';
import NULL_PROFILE_PICTURE from '@/assets/generic_profile_picture.png'
import AddRoleSection from '../../_components/AddRoleSection';
import AssignedRolesSection from '../../_components/AssignedRolesSection';
interface IPageProps {
  params: Promise<{
    id: string
  }>
}
export default async function Page(props: IPageProps) {
  const { id } = await props.params;
  const res = await getUserDetailsAsync(id);
  //? handle user data
  const user: IUserDetails = {
    id: res.data?.id ?? '',
    fullName: res.data?.fullName ?? 'Unknown User',
    phoneNumber: res.data?.phoneNumber || '+20 000-000-0000',
    image: res.data?.image,
    roles: res.data?.roles ?? [Role.User]
  }
  //? handle roles to add
  const allRoles: Role[] = [Role.User, Role.Moderator, Role.Admin];
  const availableRoles: Role[] = allRoles.filter(r => !user.roles.includes(r));
  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl">

          {/* Breadcrumbs */}
          <div className='flex items-center gap-2 pb-6'>
            <Link className='text-pale-sky hover:text-dodger-blue' href={'/dashboard/users'}><i className="fa-solid fa-arrow-left text-xs"></i> Users</Link>
            <span>/</span>
            <span>{user.fullName}</span>
          </div>

          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">
              Manage User Roles
            </h1>
          </div>

          {/* ProfileHeader */}
          <div className="p-6 bg-background rounded-xl mb-8 border border-athens-gray">
            <div className="flex w-full flex-col gap-4 @container @[520px]:flex-row @[520px]:items-center">
              <div className="flex items-center gap-5">
                <ProfileImageWithLightbox
                  src={user?.image ?? NULL_PROFILE_PICTURE}
                  alt={`Profile picture of ${user?.fullName}`}
                />

                <div className="flex flex-col justify-center">
                  <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                    {user?.fullName}
                  </p>
                  <p className="text-pale-sky text-base font-normal leading-normal">
                    {user?.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Roles Section - Static for now */}
          {/* <div className="bg-background rounded-xl p-6 border border-athens-gray mb-8">
            <h2 className=" text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
              Assigned Roles
            </h2>
            <div className="flex flex-wrap gap-3">
              {user?.roles.length ?? 0 > 0 ? (
                user?.roles.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-dodger-blue/10 text-dodger-blue px-3 py-1 text-sm font-medium cursor-pointer group"
                  >
                    <span className='text-md'>{role}</span>
                    <button className="transition-colors cursor-pointer group-hover:text-rejected-t">
                      <i className="fa-solid fa-xmark mt-1"/>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-pale-sky text-sm">No roles assigned to this user.</p>
              )}
            </div>
          </div> */}
          <AssignedRolesSection userId={user.id} assignedRoles={user.roles} />

          {/* Add New Role Section - Static for now */}
              <AddRoleSection userID={user.id} availableRoles={availableRoles}/>
        </div>
      </main>
    </div>
  );
}