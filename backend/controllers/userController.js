const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateToken");
const transporter = require("../utils/transporter");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const ShortUniqueId = require("short-unique-id");
const { deleteImage, uploadImage } = require("../utils/uploadImage");
const {
  FIREBASE_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  FIREBASE_UNIVERSAL_DOMAIN,
  EMAIL_USER,
  FRONTEND_URL,
} = require("../config/dotenv.config");
const { randomUUID } = new ShortUniqueId({ length: 5 });

// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: "service_account",
//     project_id: "blog-app-68f79",
//     private_key_id: "40fa9118111c381eed804831403f10b98be29483",
//     private_key:
//       "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCy9cabMk/4K40a\n5Jh6+22O8D+21JgGJ/POK0gJprHXu7ups9cBnvQ/DznQt5UP+BbXh8Y6gDM/ZnXU\nHXALIrGliCdUuZ9+7k3WLBOi56GkqAchVR5OJasOX0P8tfvf49B/7grwh48xuX64\nneG0b8Y9mqwQLIfr0DadklZBBzMnKOoDTuq1qXWF6ekZ6v/kWGZOtNM+MyJqqP59\nCLWnB3Jv1Z/ApFZ+J3rnsrtmgakw+1OyaAYbRBdVReVYYQWWFmj7YyufO9kAWY9Y\nQeBtIqpWhymIU3T0nMLs8DgiznA57ESYRs+5lR7IDwV7AX7C5HnOLfLrsuTjLpL9\n6qX0gXojAgMBAAECggEAV/NrMp3E6In61JMxDwvfOacAISoVNr1O2G2z/y5B6+zz\nG0Frsvu8PPuOJfH7W7hI/Y7YUKrtxMRltyPqi0Z3OQuTjNOXO8oBTfcmhWLCMcp0\niqCq/qwLh8ow/xMvIMb1EtJZ5QEyUjVAPpo1MTjXnDIWSvKfsDiJhuJC6r2Pmbfx\niYxR8H0dw88L2gGMfpwL8r3hiDoUeoQJwVVbQp92CpA2UhwYMrZMYXjHnrAiorxY\n9Xt61DWKUzYp6UMzzrYVe7pRrsqXfzztnG/UMokBZzUv1st9NfJXB8nTC4Av9CYx\nYdXp6+3w0ysc30DX4XXD4BhSgApiweZeED+5oX1I5QKBgQDwocVn0cw8JYSPp3+w\niFFwgsG+UJZnWg5FeeaCHG5qzzXlHbSEX1tCMUl0LjeI7atm5Noy+5kVUF2UAxVg\nTzJLJ60W2xGBPmtg2fqONMQknVq1wV1921u+HBr7h4moROrK8z7W6kXmo0Q3XLyj\nMLIalIqw12okbAJTSWkP+uLoPwKBgQC+Y7I76wVld0Ov/JZ09Q3FdA8/f3kTz1NZ\nfdxuYdZrpMFHhRua48Qyc4B9f5xeGd7P/PEVXtx+QXP9nHyaIVcyd02NCKUf3vxV\nqL8SZKWoywpetOVYcN/qaizMr2ZPnElh5Sm0wCEkOYF4fDogZW5n+COPtujUlo8x\nRS1hJEAVHQKBgCDNjMGYYgUZADctGEUScDesO4kcJ0SzjBqAgaHfClZZJPm00PTy\notglK+RAoKVz8Ne3/t7QWZAEQp14xiM46JxCLmBdQMejoLO1Q2i7XLm5EbKRR5Nu\nodUKs8ryMRvVOUStYDWf/iNwwk3hwH1mmADzmux8kSWh67c63K2m/+O1AoGAVAyn\nLpR+eWDBXPvhYBiez8CAysN3rCsm3KcXnRNMGZFOUkiM+z/56VvcKYsgeNpq5t7/\nfzO1m3dBwYBH8bMuT3Ujo1NhskQ6mYY5c+FC0NVx6oVpijWqZE4jIOl9/T89lh4Y\n31bCSr+oTIxrDMo6h2OgL13MQ62D4XhspCngsHECgYBzKYeIgFOGVBW88DRAs8Mw\nLSMlTY/fJfXQYsX9LqwI+d13PQydsa/aBiblyZnWfxvboUGWQXgthzTzTSqDJukP\nt8MaHvxE+bjl0yRMoE6qiVbYYA5GDwqBSFP17XklcsV499LnmuKgcXo7LDCKeFLh\niHkS0y4YIq2BMAZ5YsFpZA==\n-----END PRIVATE KEY-----\n",
//     client_email:
//       "firebase-adminsdk-fbsvc@blog-app-68f79.iam.gserviceaccount.com",
//     client_id: "108968868120275941648",
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url:
//       "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40blog-app-68f79.iam.gserviceaccount.com",
//     universe_domain: "googleapis.com",
//   }),
// });

admin.initializeApp({
  credential: admin.credential.cert({
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY,
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: FIREBASE_UNIVERSAL_DOMAIN,
  }),
});

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const deletedusers = await User.findByIdAndDelete(id);
    // let updatedusers = users.map((user, index) =>
    //   user.id == id ? { ...user[index], ...req.body } : user
    // );
    // users = [...updatedusers];
    if (!deletedusers) {
      return res.status(200).json({
        Sucess: false,
        message: "Users Not found",
      });
    }
    return res.status(200).json({
      Sucess: true,
      message: "Users deleted successfully",
      deletedusers,
      // users.splice(Number(id) - 1, 1);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  try {
    const { name, username, bio } = req.body;
    const image = req.file;

    const user = await User.findById(id);

    if (!req.body.profilePic) {
      if (user.profilePicId) {
        await deleteImage(user.profilePicId);
      }
      user.profilePic = null;
      user.profilePicId = null;
    }

    if (image) {
      const { secure_url, public_id } = await uploadImage(
        `data:image/jpeg;base64,${image.buffer.toString("base64")}`
      );
      user.profilePic = secure_url;
      user.profilePicId = public_id;
    }

    if (user.username !== username) {
      const findUser = await User.findOne({ username });
      if (findUser) {
        return res.status(400).json({
          Sucess: false,
          message: "Username already taken",
        });
      }
    }

    user.username = username;
    user.bio = bio;
    user.name = name;

    await user.save();

    res.status(200).json({
      Sucess: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        profilePic: user.profilePic,
        bio: user.bio,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function createUsers(req, res) {
  const { name, password, email } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please fill the name",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the password",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please fill the email",
      });
    }
    const checkforexistingUser = await User.findOne({ email });
    if (checkforexistingUser) {
      if (checkforexistingUser.googleAuth) {
        return res.status(400).json({
          Sucess: true,
          message:
            "Email already registered. Please try continue through with google",
        });
      }
      if (checkforexistingUser.isVerify) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      } else {
        let verificationToken = await generateJWT({
          email: checkforexistingUser.email,
          id: checkforexistingUser._id,
        });

        const sendingEmail = transporter.sendMail({
          from: EMAIL_USER,
          to: checkforexistingUser.email,
          subject: "Email Verification",
          text: "Please verify your email",
          html: `<h1>Click on the below link to verify your email</h1>
      <a href="${FRONTEND_URL}verify-email/${verificationToken}">Verify Email</a>
      `,
        });
        return res.status(200).json({
          success: true,
          message: "Please Check Your E-Mail to Verify your Account",
        });
      }
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const username = email.split("@")[0] + randomUUID();

    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
      username,
    });
    let verificationToken = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    const sendingEmail = transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: "Please verify your email",
      html: `<h1>Click on the below link to verify your email</h1>
      <a href="${FRONTEND_URL}verify-email/${verificationToken}">Verify Email</a>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Please Check Your E-Mail to Verify your Account",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function login(req, res) {
  const { password, email } = req.body;
  try {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the password",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please fill the email",
      });
    }
    const checkforexistingUser = await User.findOne({ email }).select(
      "password isVerify name email profilePic username bio showlikeBlogs showSavedBlogs"
    );
    if (!checkforexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
    }

    if (checkforexistingUser.googleAuth) {
      return res.status(400).json({
        Sucess: true,
        message:
          "Email already registered. Please try continue through with google",
      });
    }

    let checkforPass = await bcrypt.compare(
      password,
      checkforexistingUser.password
    );
    if (!checkforPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    if (!checkforexistingUser.isVerify) {
      let verificationToken = await generateJWT({
        email: checkforexistingUser.email,
        id: checkforexistingUser._id,
      });

      const sendingEmail = transporter.sendMail({
        from: EMAIL_USER,
        to: checkforexistingUser.email,
        subject: "Email Verification",
        text: "Please verify your email",
        html: `<h1>Click on the below link to verify your email</h1>
      <a href="${FRONTEND_URL}verify-email/${verificationToken}">Verify Email</a>
      `,
      });

      return res.status(400).json({
        success: false,
        message: "Please Check Your E-Mail to Verify your Account",
      });
    }

    let token = await generateJWT({
      email: checkforexistingUser.email,
      id: checkforexistingUser._id,
    });
    return res.status(200).json({
      Sucess: true,
      message: "User Login sucessfully",
      user: {
        id: checkforexistingUser._id,
        name: checkforexistingUser.name,
        email: checkforexistingUser.email,
        profilePic: checkforexistingUser.profilePic,
        token,
        username: checkforexistingUser.username,
        bio: checkforexistingUser.bio,
        showlikeBlogs: checkforexistingUser.showlikeBlogs,
        showSavedBlogs: checkforexistingUser.showSavedBlogs,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    return res.status(200).json({
      Sucess: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}

async function getUserbyId(req, res) {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .populate("blogs followers followings likeBlogs saveBlogs")
      .populate({
        path: "followers followings",
        select: "name username",
      })
      .select("-password, -isVerify -email -__v -googleAuth");
    if (!user) {
      return res.status(200).json({
        Sucess: false,
        message: "Users Not found",
      });
    }
    return res.status(200).json({
      Sucess: true,
      message: "Users fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { verificationToken } = req.params;
    const verifyToken = await verifyJWT(verificationToken);

    if (!verifyToken) {
      return res.status(400).json({
        Sucess: false,
        message: "Invalid Token/Email Expired",
      });
    }
    const { id } = verifyToken;
    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({
        Sucess: false,
        message: "User Not Exist",
      });
    }
    return res.status(200).json({
      Sucess: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function googleAuth(req, res) {
  try {
    const { accessToken } = req.body;
    const response = await getAuth().verifyIdToken(accessToken);
    const { name, email } = response;
    let user = await User.findOne({ email });

    if (user) {
      if (user.googleAuth) {
        let token = await generateJWT({
          email: user.email,
          id: user._id,
        });

        return res.status(200).json({
          Sucess: true,
          message: "Account Logged in sucessfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            username: user.username,
            bio: user.bio,
            showlikeBlogs: user.showlikeBlogs,
            showSavedBlogs: user.showSavedBlogs,
            token,
          },
        });
      } else {
        return res.status(400).json({
          Sucess: true,
          message: "Email already registered. Try Loggin in without google",
        });
      }
    }
    const username = email.split("@")[0] + randomUUID();

    let newUser = await User.create({
      name,
      email,
      googleAuth: true,
      isVerify: true,
      username,
    });

    let token = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      Sucess: true,
      message: "Account Registered sucessfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
        username: newUser.username,
        bio: newUser.bio,
        showlikeBlogs: newUser.showlikeBlogs,
        showSavedBlogs: newUser.showSavedBlogs,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function followUser(req, res) {
  try {
    const followerId = req.user;
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(200).json({
        Sucess: true,
        message: "User is not found",
      });
    }
    if (!user.followers.includes(followerId)) {
      await User.findByIdAndUpdate(id, { $set: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $set: { followings: id } });
      return res.status(200).json({
        Sucess: true,
        message: "Followed",
      });
    } else {
      await User.findByIdAndUpdate(id, { $unset: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $unset: { followings: id } });
      return res.status(200).json({
        Sucess: true,
        message: "Unfollowed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function changeSAVEDLIKEDBlog(req, res) {
  try {
    const userId = req.user;
    const { showlikeBlogs, showSavedBlogs } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({
        Sucess: true,
        message: "User is not found",
      });
    }

    await User.findByIdAndUpdate(userId, { showSavedBlogs, showlikeBlogs });
    return res.status(200).json({
      Sucess: true,
      message: "Visiblity Updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  deleteUser,
  updateUser,
  createUsers,
  getAllUsers,
  getUserbyId,
  login,
  verifyEmail,
  googleAuth,
  followUser,
  changeSAVEDLIKEDBlog,
};
