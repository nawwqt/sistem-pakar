import Image from "next/image";
import Link from "next/link";

const Logo = ({ isWhite = false, className = "h-11 sm:h-12" }) => {
  return (
    <Link
      href="/"
      className="navbar-brand inline-flex items-center py-0.5 focus:outline-none group"
    >
      <Image
        src={isWhite ? "/images/logo-white.png" : "/images/logo.png"}
        alt="BacaBisa"
        width={383}
        height={243}
        className={`${className} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
        priority
      />
    </Link>
  );
};

export default Logo;
