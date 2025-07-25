import RegisterPage from "@/components/auth/Register";
import Layout from "@/components/layouts/Layout";

export default function Home() {
  return (
    <>
      <Layout>
        <div>
          <RegisterPage />
        </div>
      </Layout>
    </>
  );
}
