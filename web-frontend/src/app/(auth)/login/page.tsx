import LoginPage from "@/components/auth/Login";
import Layout from "@/components/layouts/Layout";
export default function Home() {
  return (
    <>
      <Layout>
        <div>
          <LoginPage />
        </div>
      </Layout>
    </>
  );
}
