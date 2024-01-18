import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const PageContainer = ({ children, className }: Props) => {
  return (
    <div
      className={`w-full max-w-screen-xl mx-auto px-6 relative ${className}`}
    >
      {children}
    </div>
  );
};
