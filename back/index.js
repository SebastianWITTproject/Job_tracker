const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Schema part
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  status: String,
  date: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Job = mongoose.model('Job', jobSchema);


// Manage token verification
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

//handle signin/signup
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      username: user.username  
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Get jobs filtered by ID and eventually filter select option
app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;
    const filter = { userId, ...status && { status } };
    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// Add a new job from user
app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const newJob = new Job({ ...req.body, userId });
    await newJob.save();
    res.json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Error adding job' });
  }
});

// Delete a job for the user
app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own jobs' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting job' });
  }
});

// Update the job status
app.put('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You can only update your own jobs' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Error updating job' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
