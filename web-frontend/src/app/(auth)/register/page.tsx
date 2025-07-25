import RegisterPage from "@/components/auth/Register";
import Layout from "@/components/layouts/Layout";

export default function Home() {
  return (
    <>
      <Layout>
        <div className="flex flex-wrap">
          <div className="w-1/2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            excepturi nihil, assumenda asperiores eaque molestias voluptatibus
            voluptatem repudiandae ex quae, eos qui debitis esse, maiores
            sapiente nisi autem tempora perspiciatis.
          </div>
          <div className="w-1/2">
            <div>
              <RegisterPage />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
