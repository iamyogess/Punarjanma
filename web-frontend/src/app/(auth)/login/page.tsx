import LoginPage from "@/components/auth/Login";
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
                Welcome Back to Punarjanma
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md">
                Continue your learning journey with us. Access your courses,
                track your progress, and stay on the path of transformation and
                growth.
              </p>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li>• Resume where you left off</li>
                <li>• Access all enrolled courses</li>
                <li>• Get personalized recommendations</li>
                <li>• Learn at your own pace</li>
              </ul>
              <p className="text-base font-medium text-muted-foreground pt-4">
                Not a member yet?{" "}
                <span className="text-primary font-semibold">
                  Sign up and start your journey today.
                </span>
              </p>
            </div>

            <div className="w-1/2">
              <div>
                <LoginPage />
              </div>
            </div>
          </div>
        </WidthWrapper>
      </Layout>
    </>
  );
}
