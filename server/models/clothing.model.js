import mongoose from 'mongoose';


const clothingSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    required: true
  },
  stallNumber: {
    type: Number, 
    required: true
  },
  FloorNumber: {
    type: Number, 
    required: true
  },
 
  Des: {
    type: String,
    required: true
  }
});


const clothing = mongoose.model('clothing', clothingSchema);

export default  clothing;