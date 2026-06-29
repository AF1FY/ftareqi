import type { SVGProps } from "react";

export interface LogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", ...props }) => {
    return (
        <svg
      viewBox="0 0 450 225"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width='100%'
      height='100%'
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M269.172 0H448.62L403.067 119.758H269.172L230.521 225H0L45.5521 90.7258H238.804L269.172 0Z"
        fill="currentColor"
      />
      <path
        d="M450 225C450 188.923 425.898 159.677 396.166 159.677C366.434 159.677 342.331 188.923 342.331 225H450Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Logo;