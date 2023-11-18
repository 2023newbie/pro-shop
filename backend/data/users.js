import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Duck',
    email: 'duck@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: true
  },
  {
    name: 'Tony',
    email: 'tony@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: false
  },
  {
    name: 'Queen',
    email: 'queen@gmail.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: false
  },
]

export default users