const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const StorySchema = new Schema({
  title:{
    type:String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  status: {
    type: String,
    default:'public'
  },
  allowComments: {
    type: Boolean,
    default:true
  },
  // 
  comments: [{ 
    commentBody: {
      type: String,
      required: true
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{ // Reference to User model, ~relationship in relational db. Using ObjectId as primary key
      type: Schema.Types.ObjectId,
      ref:'users' 
    }
  }],
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  date:{
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('stories', StorySchema, 'stories');
// added 3rd arg 'stories' in plural coz to avoid creating 'story' viz done by default