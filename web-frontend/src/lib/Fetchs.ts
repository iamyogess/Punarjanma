import { API } from "@/lib/API"
import { API_ENDPOINTS } from "@/lib/APIEndPoints"

export const registerUser=await(payload:RegisterUserType)=>{
    const {data}=await API.post(API_ENDPOINTS.REGISTER,payload ,{ headers: {
    //   Authorization: token,
      "Content-Type": "application/json",
    },
})
}