import { Metadata } from "next";
import PublicLayout from "@/components/layout/public-layout";
import AboutContent from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "关于我 - Spring Broken AI Blog",
  description: "了解更多关于我的信息",
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <AboutContent />
    </PublicLayout>
  );
}
