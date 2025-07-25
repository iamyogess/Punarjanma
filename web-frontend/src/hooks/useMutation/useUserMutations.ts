import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupInput) => {
      const res = await axios.post("/api/signup", data);

      console.log("signup res: ", res);

      return res.data;
    },
  });
};
