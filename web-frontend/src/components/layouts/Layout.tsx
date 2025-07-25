import React from "react";
import Navigation from "./Navbar";
import Footer from "./Footer";
type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Navigation />
      <div className="min-h-[80dvh]">{children}</div>
      <Footer />
    </>
  );
}
