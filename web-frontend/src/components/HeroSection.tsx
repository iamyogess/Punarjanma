// "use client";
// import { Button } from "./ui/button";
// import { ArrowRight, Banknote } from "lucide-react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import WidthWrapper from "./WidthWrapper";

// const HeroSection = () => {
//   return (
//     <section className="md:h-[85vh] py-12 md:py-20 overflow-hidden">
//       <WidthWrapper>
//         <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
//           {/* Left content */}
//           <div className="w-full md:w-1/2 space-y-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
//                 Fast & Reliable Delivery
//               </span>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
//                 <span className="text-primary">
//                   #1 Peer to Peer Courier Service{" "}
//                 </span>
//                 <br /> In Nepal
//               </h1>
//               <p className="text-base md:text-xl text-muted-foreground mt-4 max-w-md">
//                 {/* All in one courier service at your fingertips. Fast, secure, and
//                 reliable delivery across Nepal. */}
//                 Connect with trusted travelers and send your packages safely
//                 across the globe. Fast, secure, and affordable delivery
//                 solutions.
//               </p>
//             </motion.div>

//             <motion.div
//               className="flex flex-col w-auto  md:w-fit gap-4 pt-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <Button className="group h-11 md:h-13 md:w-52 cursor-pointer">
//                 <Banknote className="mr-2 h-5 w-5" />
//                 <Link href="/auth/signup">Earn with MeroFly</Link>
//                 <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="group h-11 md:h-13 md:w-52 cursor-pointer"
//               >
//                 <Banknote className="mr-2 h-5 w-5" />
//                 <Link href="/auth/signup">Send with MeroFly</Link>
//                 <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//               </Button>
//             </motion.div>
//           </div>

//           {/* Right content - Image */}
//           <motion.div
//             className="w-full md:w-1/2 flex justify-center"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7 }}
//           >
//             <div className="relative">
//               <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
//               <Image
//                 src="/hero.svg"
//                 alt="MeroFly Courier Service"
//                 width={500}
//                 height={500}
//                 className="drop-shadow-xl"
//                 priority
//               />
//             </div>
//           </motion.div>
//         </div>
//       </WidthWrapper>
//     </section>
//   );
// };

// export default HeroSection;


"use client";
import { Button } from "./ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import WidthWrapper from "./WidthWrapper";

const HeroSection = () => {
  return (
    <section className="md:h-[85vh] py-12 md:py-20 overflow-hidden">
      <WidthWrapper>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left content */}
          <div className="w-full md:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Learn. Grow. Succeed.
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary">Empowering Learners </span>
                <br /> to Build the Future
              </h1>
              <p className="text-base md:text-xl text-muted-foreground mt-4 max-w-md">
                Unlock your potential with expert-led courses in tech, business,
                and personal growth. Learn at your own pace. Build real-world skills.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col w-auto md:w-fit gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button className="group h-11 md:h-13 md:w-52 cursor-pointer">
                <GraduationCap className="mr-2 h-5 w-5" />
                <Link href="/auth/signup">Start Learning</Link>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                className="group h-11 md:h-13 md:w-52 cursor-pointer"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                <Link href="/courses">Browse Courses</Link>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Right content - Image */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
              <Image
                src="/learning-hero.svg" // Replace with an educational-themed illustration
                alt="Online Learning Platform"
                width={500}
                height={500}
                className="drop-shadow-xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </WidthWrapper>
    </section>
  );
};

export default HeroSection;
