import UserModel from "../models/user-model";

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
      .select("-password", "verificationCode", "verificationCodeExpiry")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments();

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalUsers: users,
        nextPage: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    await UserModel.findByIdAndDelete(userId);

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: false,
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      "-password -verificationCode -verificationCodeExpiry"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message:
          "Wrong current password! Please enter a correct current password!",
      });
    }

    user.password = newPassword;
    user.save();

    return res.status(200).json({
      success: false,
      message: "Password changed successfully!",
    });
  } catch (error) {
    next(error);
  }
};
