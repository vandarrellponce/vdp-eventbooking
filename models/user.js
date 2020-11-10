import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
})

/* Hash user password before saving to database */
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8)
  next()
})

const User = mongoose.model('User', userSchema)

export default User
