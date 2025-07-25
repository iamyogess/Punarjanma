type RegisterPayloadType = {
  fullName: string;
  email: string;
  password: string;
  role: string;
};

type ResendEmailVarificationPayloadType = {
  email: string;
};

type EmailVarificationPayloadType = {
  email: string;
  verificationCode: string;
};

type LoginPayloadType = {
  email: string;
  password: string;
};

type LoginResponseDataType = {
  success: boolean;
  accessToken: string;
  message: string;
  user: {
    email: string;
    isVerified: boolean;
    role: string;
    _id: string;
  };
};
