"use client";
import Image from "next/image";
import signup_image from "@/assets/signup_image.png";

const RegisterLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="bg-[#fbfcff] dark:bg-background min-h-screen pt-20 md:pt-0 flex items-center">
      <div className="container flex flex-col md:flex-row items-center">
        <picture className="md:w-1/2 order-2 md:order-1 hidden lg:block">
            <Image className="m-auto" src={signup_image} alt="carpooling" />
        </picture>
        <div className="order-1 lg:w-1/2 py-6 m-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
// container flex flex-col md:flex-row items-center text-center xl:gap-16 justify-center