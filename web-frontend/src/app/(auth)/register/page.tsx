import RegisterPage from "@/components/auth/Register";
import Layout from "@/components/layouts/Layout";
import WidthWrapper from "@/components/WidthWrapper";

export default function Home() {
  return (
    <>
      <Layout>
        <WidthWrapper>
          <div className="flex w-full md:h-[80vh] justify-center items-center flex-wrap">
            <div className="w-full md:w-1/2 px-6 md:px-12 py-12 space-y-6">
              <h1 className="text-4xl font-bold text-primary">
                Your Journey Starts Here
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md">
                Discover your potential, upgrade your skills, and build a future
                you believe in. Punarjanma is more than just a learning platform
                — it's your path to transformation.
              </p>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li>• Learn from industry experts</li>
                <li>• Build real-world projects</li>
                <li>• Join a growing community of learners</li>
                <li>• Track your progress and career growth</li>
              </ul>
              <p className="text-base font-medium text-muted-foreground pt-4">
                Sign up today and take the first step toward your{" "}
                <span className="text-primary font-semibold">Punarjanma</span> —
                a fresh start powered by knowledge.
              </p>
            </div>
            <div className="md:w-1/2">
              <div>
                <RegisterPage />
              </div>
            </div>
          </div>
        </WidthWrapper>
      </Layout>
    </>
  );
}
