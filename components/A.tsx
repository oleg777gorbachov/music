import Link from "next/link";
import { JSXElementConstructor, ReactElement } from "react";

type AI = {
  path: string;
  children: ReactElement<any> | string | React.ReactNode;
  className?: string;
};

function A({ path, children, className }: AI) {
  return (
    <Link href={path} className={className}>
      {children}
    </Link>
  );
}

export default A;
