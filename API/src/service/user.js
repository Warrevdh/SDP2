const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const register = async ({
  userId,
  firstname,
  lastname,
  email,
  password,
  country,
  city,
  postalCode,
  street,
  addressNumber,
  phoneNumber,
  telNumber,
  logo,
}) => {
  debugLog("Creating a new user", {
    userId,
    firstname,
    lastname,
    email,
    country,
    city,
    postalCode,
    street,
    addressNumber,
    phoneNumber,
    telNumber,
    logo,
  });

  try {
    // check if user already exists
    const existingUser = await findUserByEmail(email.toLowerCase());

    if (existingUser) {
      throw ServiceError.forbidden(`User with email: ${email} already exists`, {
        email,
      });
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user in database
    const user = await getPrisma().user.create({
      data: {
        userId,
        firstname: firstname,
        lastname: lastname,
        email: email.toLowerCase(),
        password: encryptedPassword,
        country: country,
        city: city,
        postalCode,
        street: street,
        addressNumber,
        phoneNumber,
        telNumber,
        logo,
      },
    });

    // iss (issuer): Issuer of the JWT
    // sub (subject): Subject of the JWT (the user)
    // aud (audience): Recipient for which the JWT is intended
    // exp (expiration time): Time after which the JWT expires
    // nbf (not before time): Time before which the JWT must not be accepted for processing
    // iat (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
    // jti (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once)

    // create JWT token
    const token = jwt.sign(
      {
        iss: "https://www.localhost.com",
        sub: user.userId,
        aud: "https://www.localhost.com",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        nbf: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        jti: user.userId,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    user.token = token;

    return user;
  } catch (error) {
    const logger = getChildLogger("user-service");
    logger.error("Error while creating a new user", { error });
    throw error;
  }
};

const login = async ({ email, password }) => {
  debugLog("Logging in user", { email });
  try {
    // find user in database
    const user = await findUserByEmail(email.toLowerCase());

    // check if user exists
    if (!user) {
      throw ServiceError.notFound(`User with id: ${email} not found`, {
        email,
      });
    }

    // check if password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw ServiceError.unauthorized("Invalid password", { email });
    }

    // iss (issuer): Issuer of the JWT
    // sub (subject): Subject of the JWT (the user)
    // aud (audience): Recipient for which the JWT is intended
    // exp (expiration time): Time after which the JWT expires
    // nbf (not before time): Time before which the JWT must not be accepted for processing
    // iat (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
    // jti (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once)

    // create JWT token
    const token = jwt.sign(
      {
        iss: "https://www.localhost.com",
        sub: user.userId,
        aud: "https://www.localhost.com",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        nbf: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        jti: user.userId,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    user.token = token;

    return user;
  } catch (error) {
    const logger = getChildLogger("user-service");
    logger.error("Error while logging in user", { error });
    throw error;
  }
};

const findUserByEmail = async (email) => {
  const user = await getPrisma().user.findUnique({
    where: {
      email,
    },
    include: {
      Company: true,
    },
  });

  return user;
};

const findUserById = async (userId) => {
  debugLog("Finding user by id", { userId });
  try {
    const user = await getPrisma().user.findUnique({
      where: {
        userId,
      },
      include: {
        Company: true,
      },
    });
    if (!user)
      throw ServiceError.notFound(`User with id: ${userId} not found`, {
        userId,
      });
    return user;
  } catch (error) {
    const logger = getChildLogger("user-service");
    logger.error("Error while finding user by id", { error });
    throw error;
  }
};

const updateUserById = async (userId, data) => {
  // print all data except password
  debugLog("Updating user by userId", {
    userId,
    data: { ...data, oldPassword: "****", password: "****" },
  });
  const existingUser = await findUserById(userId);
  try {
    let encryptedPassword;
    // check if password is valid
    if (data.oldPassword) {
      const isValidPassword = await bcrypt.compare(
        data.oldPassword,
        existingUser.password
      );

      if (!isValidPassword) {
        throw ServiceError.unauthorized("Invalid password", { userId });
      }

      encryptedPassword = await bcrypt.hash(data.password, 10);
    }

    const user = await getPrisma().user.update({
      where: {
        userId,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: encryptedPassword,
        country: data.country,
        city: data.city,
        postalCode: data.postalCode,
        street: data.street,
        addressNumber: data.addressNumber,
        phoneNumber: data.phoneNumber,
        telNumber: data.telNumber,
      },
    });
    return user;
  } catch (error) {
    const logger = getChildLogger("user-service");
    logger.error("Error while updating user by userId", { error });
    throw error;
  }
};

const deleteUserById = async (userId) => {
  debugLog("Deleting user by email", { userId });
  try {
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      throw ServiceError.notFound(`User with email: ${userId} not found`, {
        userId,
      });
    }
    const user = await getPrisma().user.delete({
      where: {
        userId,
      },
    });
    return user;
  } catch (error) {
    const logger = getChildLogger("user-service");
    logger.error("Error while deleting user by email", { error });
    throw error;
  }
};

module.exports = {
  register,
  login,
  findUserById,
  updateUserById,
  deleteUserById,
};
