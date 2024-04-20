const myModel = require("../model/signup");
const bcrypt = require("bcryptjs");
const { transporter } = require("./transporter");
const { generateOTP } = require("./genOtp");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config(); // .env file

// secret key from environment variables
const secret = process.env.JWT_SECRET;

// Set up Redis for OTP storage
const redisClient = redis.createClient();

// Connecting to reddis
redisClient.on('error', (err) => {
    console.error("Redis connection error:", err);
});

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate req input
        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check email already exists
        const existingUser = await myModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        // password Hashing 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save data
        const data = new myModel({ email, password: hashedPassword });
        const result = await data.save();

        if (result) {
            return res.status(200).json({ result: true });
        } else {
            // Server problem 
            return res.status(500).json({ error: "Server problem occurred" });
        }
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Request OTP and send to the email
const requestOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Generate a 4-digit OTP
        const otp = generateOTP();

        // Store the OTP in Redis for 5 min expiration time
        redisClient.setex(email, 300, otp, (err) => {
            if (err) {
                console.error("Error storing OTP in Redis:", err);
                return res.status(500).json({ message: "Failed to send OTP" });
            }
        });

        // Send the OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: "Your OTP for verification",
            text: `Your OTP for email verification is: ${otp}`,
        });

        // Respond with success
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};

// Verify OTP and generate a JWT token
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        // gettting the OTP form redis
        redisClient.get(email, (err, storedOtp) => {
            if (err || !storedOtp) {
                return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
            }

            // Verify the OTP
            if (storedOtp === otp) {
                // Delete the OTP from Redis after verification
                redisClient.del(email);

                // Generate a JWT token
                const token = jwt.sign({ email }, secret, { expiresIn: '1h' });

                return res.status(200).json({ userToken: token });
            } else {
                // Invalid OTP
                return res.status(400).json({ message: "Invalid OTP" });
            }
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login function to verify JWT token and respond accordingly
const login = async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ status: false });
    }

    try {
        const auth = jwt.verify(token, secret);
        if (auth) {
            return res.status(200).json({ userToken: token });
        } else {
            return res.status(401).json({ status: false });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(401).json({ status: false });
    }
};

module.exports = { signup, requestOTP, verifyOTP, login };
