import User from '../models/userModel.js'
import asyncHandler from '../middleware/asyncHandler.js'
import generateToken from '../utils/generateToken.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password.')
  }
})

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body

  const existUser = await User.findOne({email})

  if (existUser) {
    res.status(400)
    throw new Error('User already exists.')
  }

  const user = await User.create({ name, email, password })
  
  if (user) {
    generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data.')
  }
})

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({ message: 'Logged out successfully.'})
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Public
const getUserProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  req.user.name = req.body.name || req.user.name
  req.user.email = req.body.email || req.user.email

  if (req.body.password) {
    req.user.password = req.body.password
  }

  const updatedUser = await req.user.save()

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  })
})

// @desc    Get users
// @route   GET /api/users
// @access  Private/admin
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({})
  res.status(200).json(users)
})

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/admin
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id}).select('-password')
  if (user) {
    res.status(201).json(user)
  } else {
    res.status(404)
    throw new Error('User not found') 
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id})
  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cannot delete admin user.')
    }
    await user.deleteOne()
    res.status(201).json({message: 'User deleted successfully'})
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin

    const updatedUser = await user.save()
    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
    
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
